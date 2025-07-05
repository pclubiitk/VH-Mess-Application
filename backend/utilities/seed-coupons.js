// =================================================================
//                      COUPON SEEDER
// =================================================================
// File: coupon-seeder.js
// Description: Populates the database with a large set of test coupons.
// Usage: docker compose exec app node coupon-seeder.js
// =================================================================

const { PurchasedCoupon, sequelize } = require("../config/database");
const { v4: uuidv4 } = require("uuid");

// --- Configuration ---
const TOTAL_COUPONS_TO_CREATE = 5000;

// --- Helper Data ---
const firstNames = [
  "Aarav",
  "Vivaan",
  "Aditya",
  "Vihaan",
  "Arjun",
  "Sai",
  "Reyansh",
  "Ayaan",
  "Krishna",
  "Ishaan",
  "Saanvi",
  "Aanya",
  "Aadhya",
  "Aaradhya",
  "Anika",
  "Gauri",
  "Pari",
  "Ananya",
  "Riya",
  "Diya",
];
const lastNames = [
  "Sharma",
  "Verma",
  "Gupta",
  "Singh",
  "Kumar",
  "Patel",
  "Reddy",
  "Mehta",
  "Jain",
  "Khan",
];
const mealTypes = ["Breakfast", "Lunch", "Dinner"];
const statuses = ["Active", "Used", "Pending"];

// --- Helper Functions ---
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = () => {
  const today = new Date();
  // Get a random day between -10 and +10 days from today
  const randomDayOffset = Math.floor(Math.random() * 7) - 3;
  today.setDate(today.getDate() + randomDayOffset);
  return today.toISOString().slice(0, 10); // Format as YYYY-MM-DD
};

const seedCoupons = async () => {
  try {
    console.log("Connecting to the database...");
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // Clear existing coupons to avoid duplicates on re-runs
    console.log("Clearing existing coupons...");
    await PurchasedCoupon.destroy({ where: {}, truncate: true });

    const couponsToCreate = [];
    let currentOrderId = uuidv4();

    console.log(`Generating ${TOTAL_COUPONS_TO_CREATE} coupon entries...`);

    for (let i = 0; i < TOTAL_COUPONS_TO_CREATE; i++) {
      // Group coupons by the same order ID occasionally
      if (i % 3 === 0) {
        currentOrderId = uuidv4();
      }

      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const mealDate = getRandomDate();

      let status = getRandomElement(statuses);
      // If the coupon date is in the past, its status must be 'Expired'
      if (
        new Date(mealDate) < new Date(new Date().toISOString().slice(0, 10))
      ) {
        status = "Expired";
      }

      const coupon = {
        customer_name: `${firstName} ${lastName}`,
        customer_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        customer_phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        meal_date: mealDate,
        meal_type: getRandomElement(mealTypes),
        status: status,
        payment_id: `PAY_${Date.now()}_${i}`,
        order_id: currentOrderId,
      };
      couponsToCreate.push(coupon);
    }

    console.log("Bulk inserting coupons into the database...");
    await PurchasedCoupon.bulkCreate(couponsToCreate);

    // Reset the auto-increment counter after seeding
    await sequelize.query(
      "ALTER TABLE PurchasedCoupons AUTO_INCREMENT = 100000000;",
    );

    console.log(`\n✅ Successfully seeded ${couponsToCreate.length} coupons.`);
  } catch (error) {
    console.error("\n❌ Unable to seed coupons:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
};

seedCoupons();
