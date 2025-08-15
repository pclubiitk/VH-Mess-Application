const { MenuItem, PurchasedCoupon, sequelize, MealTiming, User  } = require("../config/database");
const{hashGenerator}=require("../utilities/generate-hash")
const xlsx = require("xlsx");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const {sendmail} =require("../utilities/mail")
const {BASE_URL}=require("../")


const uploadMenu = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded." });
  }

  const t = await sequelize.transaction();

  try {
    await MenuItem.update({ is_active: false }, { where: {}, transaction: t });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const [menuSheetName, timingSheetName] = workbook.SheetNames;

    console.log("Sheet names:", workbook.SheetNames);

    // === Parse timing sheet ===
    const timingSheet = workbook.Sheets[timingSheetName];
    const timingRows = xlsx.utils.sheet_to_json(timingSheet, { defval: "", raw: false });

    const mealTimings = [];

    timingRows.forEach((row, index) => {
      const meal = String(row.meal || "").trim().toLowerCase();
      const closetime = parseInt(row.closetime);

      if (!meal || isNaN(closetime)) {
        console.warn(`Skipping invalid timing row at index ${index}:`, row);
        return;
      }

      mealTimings.push({
        meal,
        closetime,
      });
    });

    console.log("Parsed mealTimings:", mealTimings);

    await MealTiming.destroy({ where: {}, transaction: t });
    if (mealTimings.length > 0) {
      await MealTiming.bulkCreate(mealTimings, { transaction: t });
    }

    // === Parse menu sheet ===
    const worksheet = workbook.Sheets[menuSheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    const validDays = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
    ];

    const normalizeDay = (str) => {
      const map = {
        mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
        fri: "Friday", sat: "Saturday", sun: "Sunday",
      };
      if (!str) return null;
      const key = String(str).toLowerCase().slice(0, 3);
      return map[key] || null;
    };

    const newMenuItems = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rawDay = row[0];
      const day = normalizeDay(rawDay);

      if (!day || !validDays.includes(day)) {
        console.warn("Skipping invalid day in menu sheet:", rawDay);
        continue;
      }

      const maxCoupons = row[7];

      const isValidDescription = (description) =>
        description && String(description).trim() !== "";

      if (isValidDescription(row[1]) && row[2]) {
        newMenuItems.push({
          day_of_week: day,
          meal_type: "Breakfast",
          description: String(row[1]).trim(),
          price: parseFloat(row[2]),
          is_active: true,
          max_coupons: parseInt(maxCoupons) || null,
             available_coupons: parseInt(maxCoupons) || null,
        });
      }

      if (isValidDescription(row[3]) && row[4]) {
        newMenuItems.push({
          day_of_week: day,
          meal_type: "Lunch",
          description: String(row[3]).trim(),
          price: parseFloat(row[4]),
          is_active: true,
          max_coupons: parseInt(maxCoupons) || null,
             available_coupons: parseInt(maxCoupons) || null,
        });
      }

      if (isValidDescription(row[5]) && row[6]) {
        newMenuItems.push({
          day_of_week: day,
          meal_type: "Dinner",
          description: String(row[5]).trim(),
          price: parseFloat(row[6]),
          is_active: true,
          max_coupons: parseInt(maxCoupons) || null,
          available_coupons: parseInt(maxCoupons) || null,
        });
      }
  }
  
    if (newMenuItems.length === 0) {
      throw new Error(
        "No valid menu items with descriptions found in the uploaded file.",
      );
    }

    await MenuItem.bulkCreate(newMenuItems, { transaction: t });
    await t.commit();

    res.status(201).json({
      success: true,
      message: `Successfully uploaded and updated menu with ${newMenuItems.length} items.`,
    });
  } catch (error) {
    await t.rollback();
    console.error("Menu upload failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to upload menu.",
      error: error.message,
    });
  }
};
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  console.log(adminUsername, adminPasswordHash, username, password);

  if (!adminUsername || !adminPasswordHash) {
    return res.status(500).json({
      success: false,
      message: "Admin credentials are not set up securely on the server.",
    });
  }

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a password." });
  }

  try {
    const isMatch = await bcrypt.compare(password, adminPasswordHash);

    console.log(isMatch);

    if (username === adminUsername && isMatch) {
      const token = jwt.sign({ id: "admin_user" }, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });
      res.json({ success: true, token });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during authentication." });
  }
};

const getCurrentAdminMenu = async (req, res) => {
  try {
    const menu = await MenuItem.findAll({
      where: { is_active: true },
      order: [
        sequelize.literal(
          "FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')",
        ),
        sequelize.literal("FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner')"),
      ],
    });
    res.json({ success: true, menu });
  } catch (error) {
    console.error("Error fetching current menu for admin:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const { search, meal_type, status, date } = req.query;
    const whereClause = {
      status: { [Op.ne]: "Pending" },
    };

    // Search by Order ID, Customer Name, Email, or Phone
    if (search) {
      whereClause[Op.or] = [
        { order_id: { [Op.like]: `%${search}%` } },
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_email: { [Op.like]: `%${search}%` } },
        { customer_phone: { [Op.like]: `%${search}%` } },
      ];
    }

    if (meal_type) whereClause.meal_type = meal_type;
    if (status) whereClause.status = status;
    if (date) whereClause.meal_date = date;

    const coupons = await PurchasedCoupon.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: 200,
    });
    res.json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching all coupons:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getTodaysSummary = async (req, res) => {
  try {
    const nowInIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const today = nowInIST.toISOString().split("T")[0];
    const hour = nowInIST.getHours();
    let upcomingMeal = "Dinner";
    if (hour < 10) upcomingMeal = "Breakfast";
    else if (hour < 16) upcomingMeal = "Lunch";
    // Get all coupons for today for all meal types
    const mealTypes = ["Breakfast", "Lunch", "Dinner"];
    const summary = {
      Breakfast: { Active: 0, Used: 0 },
      Lunch: { Active: 0, Used: 0 },
      Dinner: { Active: 0, Used: 0 },
    };

    const coupons = await PurchasedCoupon.findAll({
      where: {
        meal_date: today,
        meal_type: { [Op.in]: mealTypes },
        status: { [Op.in]: ["Active", "Used"] },
      },
    });

    coupons.forEach((c) => {
      if (summary[c.meal_type] && summary[c.meal_type][c.status] !== undefined) {
        summary[c.meal_type][c.status]++;
      }
    });

    res.json({ success: true, summary, upcomingMeal });
  } catch (error) {
    console.error("Error fetching today's summary:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const verifyToken = (req, res) =>
  res.status(200).json({ success: true, message: "Token is valid." });

const markCouponAsUsed = async (req, res) => {
  try {
    const { id } = req.params;
    const [affectedRows] = await PurchasedCoupon.update(
      { status: "Used" },
      { where: { id: id, status: "Active" } },
    );
    if (affectedRows > 0) {
      res.json({ success: true, message: `Coupon ${id} marked as used.` });
    } else {
      res.status(404).json({
        success: false,
        message: `Coupon ${id} not found or is not active.`,
      });
    }
  } catch (error) {
    console.error("Error marking coupon as used:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};






 const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
 const hashpass = await bcrypt.hash(password, 10);

const data = await User.create({
  name,
  email,
  password: hashpass, 
  verified: false
});

   const token = jwt.sign(
  { name: name, email: email, verified: false },
  "eeee",
  { expiresIn: "1h" }
);



    await sendmail(email,"Welcome to VH Mess" ,`Click to verify: http://172.23.35.151:3001/api/user/verify?token=${token}`);
    console.log(`Click to verify: http://172.23.35.151:3001/api/user/verify?token=${token}`)

    return res.status(201).json({ message: "Signup successful. Please check your email and complete the verification before booking." ,"status":true, "token": token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" ,"status":false});
  }
};
 const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Signin successful" ,"status":true, "token": token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

 const verify = async (req, res) => {
  try {
     const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);



      const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update({ verified: true });
const newToken = jwt.sign(
  { id: user.id, email: user.email, verified: user.verified },
 "eeee",
  { expiresIn: "1h" }
);




    res.redirect("http://localhost:8081/success/verified")
    res.json({ message: "Email verified successfully","token":newToken });
    



  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  loginAdmin,
  uploadMenu,
  getAllCoupons,
  getTodaysSummary,
  verifyToken,
  markCouponAsUsed,
  getCurrentAdminMenu,
  signin,
  signup,
  verify
};
