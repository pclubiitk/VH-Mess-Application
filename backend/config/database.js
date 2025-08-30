const { Sequelize, DataTypes } = require("sequelize");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD; // Change this
const dbHost = process.env.DB_HOST;
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  logging: false,
});
const MealTiming = sequelize.define("MealTiming", {
  meal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  closetime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      endsWithIITK(value) {
        if (!value.endsWith("@iitk.ac.in")) {
          throw new Error("Email must end with @iitk.ac.in");
        }
      },
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

const MenuItem = sequelize.define(
  "MenuItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner"),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    max_coupons: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    available_coupons: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

const PurchasedCoupon = sequelize.define(
  "PurchasedCoupon",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    booked_for: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customer_email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    customer_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meal_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    meal_type: {
      type: DataTypes.ENUM("Breakfast", "Lunch", "Dinner"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Used", "Expired", "Pending"),
      defaultValue: "Pending",
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

sequelize.sync();

module.exports = {
  sequelize,
  MenuItem,
  MealTiming,
  PurchasedCoupon,
  User,
};
