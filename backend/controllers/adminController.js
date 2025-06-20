const { MenuItem, PurchasedCoupon, sequelize } = require('../config/database');
const xlsx = require('xlsx');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    console.log(adminUsername, adminPasswordHash, username, password);

    if (!adminUsername || !adminPasswordHash) {
        return res.status(500).json({ success: false, message: 'Admin credentials are not set up securely on the server.' });
    }

    if (!password) {
        return res.status(400).json({ success: false, message: 'Please provide a password.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, adminPasswordHash);
        
        console.log(isMatch);

        if (username === adminUsername && isMatch) {
            const token = jwt.sign({ id: 'admin_user' }, process.env.JWT_SECRET, {
                expiresIn: '8h',
            });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during authentication.' });
    }
};

const uploadMenu = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const t = await sequelize.transaction();

    try {
        await MenuItem.update(
            { is_active: false },
            { where: {}, transaction: t }
        );

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const menuData = xlsx.utils.sheet_to_json(worksheet);

        const newMenuItems = menuData.map(item => {
            if (!item.day_of_week || !item.meal_type || !item.description || !item.price) {
                throw new Error('Invalid Excel format. Each row must contain day_of_week, meal_type, description, and price.');
            }
            return {
                day_of_week: item.day_of_week,
                meal_type: item.meal_type,
                description: item.description,
                price: parseFloat(item.price),
                is_active: true,
            };
        });

        await MenuItem.bulkCreate(newMenuItems, { transaction: t });
        await t.commit();

        res.status(201).json({
            success: true,
            message: `Successfully uploaded and updated menu with ${newMenuItems.length} items.`,
        });

    } catch (error) {
        await t.rollback();
        console.error('Menu upload failed:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to upload menu.',
            error: error.message,
        });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const { search, meal_type, status, date } = req.query;
        const whereClause = {
            status: { [Op.ne]: 'Pending' }
        };

        // Search by Order ID, Customer Name, Email, or Phone
        if (search) {
            whereClause[Op.or] = [
                { order_id: { [Op.like]: `%${search}%` } },
                { customer_name: { [Op.like]: `%${search}%` } },
                { customer_email: { [Op.like]: `%${search}%` } },
                { customer_phone: { [Op.like]: `%${search}%` } }
            ];
        }

        if (meal_type) whereClause.meal_type = meal_type;
        if (status) whereClause.status = status;
        if (date) whereClause.meal_date = date;
        
        const coupons = await PurchasedCoupon.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: 200
        });
        res.json({ success: true, coupons });
    } catch (error) {
        console.error('Error fetching all coupons:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const getTodaysSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const summary = await PurchasedCoupon.findAll({
            attributes: [
                'meal_type',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                meal_date: today,
                status: { [Op.ne]: 'Pending' }
            },
            group: ['meal_type']
        });

        const counts = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        summary.forEach(item => {
            const mealType = item.get('meal_type');
            const count = item.get('count');
            if (counts.hasOwnProperty(mealType)) {
                counts[mealType] = parseInt(count, 10);
            }
        });

        res.json({ success: true, summary: counts });
    } catch (error) {
        console.error('Error fetching today\'s summary:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

const verifyToken = (req, res) => res.status(200).json({ success: true, message: 'Token is valid.' });

const markCouponAsUsed = async (req, res) => {
    try {
        const { id } = req.params;
        const [affectedRows] = await PurchasedCoupon.update(
            { status: 'Used' }, { where: { id: id, status: 'Active' } }
        );
        if (affectedRows > 0) {
            res.json({ success: true, message: `Coupon ${id} marked as used.` });
        } else {
            res.status(404).json({ success: false, message: `Coupon ${id} not found or is not active.` });
        }
    } catch (error) {
        console.error('Error marking coupon as used:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports = {
    loginAdmin,
    uploadMenu,
    getAllCoupons,
    getTodaysSummary,
    verifyToken,
    markCouponAsUsed,
};

