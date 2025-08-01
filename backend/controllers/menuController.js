const { MenuItem,MealTiming } = require('../config/database');

const getCurrentMenu = async (req, res) => {
  try {
    const menu = await MenuItem.findAll({
      where: { is_active: true },
      order: [
        ['day_of_week', 'ASC'],
        ['meal_type', 'ASC'],
      ],
    });

    if (!menu || menu.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active menu found. Please ask the admin to upload one.',
      });
    }

    const lastUpdated = await MenuItem.max('updatedAt', {
      where: { is_active: true },
    });

const menuResponse = menu.map(item => ({
  day_of_week: item.day_of_week,
  meal_type: item.meal_type,
  description: item.description,
  price: item.price,
  coupons: item.max_coupons,  
  available_coupons: item.available_coupons,
}));

res.status(200).json({
  success: true,
  lastUpdated,
  menu: menuResponse,
});


  } catch (error) {
    console.error('Error fetching current menu:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};


const getCutoffMealTimings = async (req, res) => {
  try {
    const timings = await MealTiming.findAll();

    const response = {};
    timings.forEach((timing) => {
      const key = timing.meal.charAt(0).toUpperCase() + timing.meal.slice(1).toLowerCase();
      response[key] = {
        hour: parseInt(timing.closetime),
        minute: 0,
      };
    });

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (err) {
    console.error("Error fetching meal timings:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meal timings",
    });
  }
};



const getLastUpdatedTime = async (req, res) => {
  try {
    const lastUpdated = await MenuItem.max('updatedAt', {
      where: { is_active: true },
    });

    if (!lastUpdated) {
      return res.status(404).json({
        success: false,
        message: 'No active menu found.',
      });
    }

    res.status(200).json({
      success: true,
      lastUpdated,
    });
  } catch (error) {
    console.error('Error fetching last updated time:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
};


module.exports = {
    getCurrentMenu,
    getLastUpdatedTime,
    getCutoffMealTimings,

};

