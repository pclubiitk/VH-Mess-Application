const { PurchasedCoupon, MenuItem, sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const initiateOrder = async (req, res) => {
    const { customerName, customerEmail, customerPhone, selections } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !selections || !Array.isArray(selections) || selections.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid request. Please provide customer details and selections.' });
    }

    const t = await sequelize.transaction();

    try {
        let totalAmount = 0;
        const couponsToCreate = [];
        const order_id = uuidv4();

        for (const selection of selections) {
            const { meal_date, meal_type } = selection;
            updateNumberofCoupons(meal_date, meal_type);
            if (!meal_date || !meal_type) {
                throw new Error('Invalid selection format. Each selection must have a meal_date and meal_type.');
            }

            const dayOfWeek = new Date(meal_date).toLocaleString('en-US', { weekday: 'long' });

            const menuItem = await MenuItem.findOne({
                where: { day_of_week: dayOfWeek, meal_type: meal_type, is_active: true }
            });


            if (!menuItem) {
                throw new Error(`The selected meal (${meal_type} on ${meal_date}) is not available.`);
            }

            totalAmount += parseFloat(menuItem.price);

            couponsToCreate.push({
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                meal_date: meal_date,
                meal_type: meal_type,
                order_id: order_id,
                status: 'Active' //since there is no payment thing happening
            });
        }

        await PurchasedCoupon.bulkCreate(couponsToCreate, { transaction: t });
        await t.commit();

        res.status(201).json({
            success: true,
            message: 'Order received.',
            order_id: order_id,
            totalAmount: totalAmount,
            paymentGatewayDetails: {
                placeholder: 'Integrate with PhonePe SDK here.'
            }
        });

    } catch (error) {
        await t.rollback();
        console.error('Error initiating order:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to initiate order due to a server error.'
        });
    }
};
const updateNumberofCoupons = async (day_of_week, meal_type) => {



  try {
    const menuItem = await MenuItem.findOne({
      where: {
        day_of_week,
        meal_type,
        is_active: true,
      },
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found.',
      });
    }

    if (menuItem.available_coupons === null) {
      return res.status(400).json({
        success: false,
        message: 'This menu item does not have a limit on coupons.',
      });
    }

    const remainingCoupons = menuItem.available_coupons - 1;

    if (remainingCoupons < 0) {
      return res.status(400).json({
        success: false,
        message: 'Used coupons exceed the maximum allowed.',
      });
    }

    menuItem.available_coupons  = remainingCoupons;
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: 'Number of coupons updated successfully.',
      remainingCoupons,
    });
  } catch (error) {
    console.error('Error updating number of coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
}
const resetAvailableCoupons = async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll({
            where: { is_active: true },
        });
        for (const item of menuItems) {
            item.available_coupons = item.max_coupons;
            await item.save();
        }
        res.status(200).json({
            Date: new Date(),
            success: true,
            message: 'Available coupons reset successfully.',
        });
    } catch (error) {
        console.error('Error resetting available coupons:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset available coupons due to a server error.',
        });
    }
};

//     if (!order_id || !payment_id || !transaction_status) {
//         return res.status(400).json({ success: false, message: 'Invalid webhook payload.' });
//     }

//     try {
//         if (transaction_status === 'SUCCESS') {
//             const [affectedRows] = await PurchasedCoupon.update(
//                 {
//                     status: 'Active',
//                     payment_id: payment_id
//                 },
//                 {
//                     where: {
//                         order_id: order_id,
//                         status: 'Pending'
//                     }
//                 }
//             );

//             if (affectedRows > 0) {
//                 console.log(`Successfully activated ${affectedRows} coupons for order ${order_id}.`);
//             } else {
//                 console.log(`Webhook received for already processed or invalid order: ${order_id}`);
//             }
//         } else {
//             console.log(`Payment failed or was cancelled for order ${order_id}.`);
//         }
        
//         res.status(200).send('Webhook processed.');

//     } catch (error) {
//         console.error(`Error processing webhook for order ${order_id}:`, error);
//         res.status(200).send('Webhook processed with internal error.');
//     }
// };


module.exports = {
    initiateOrder,
    resetAvailableCoupons
    // confirmPayment,
};

