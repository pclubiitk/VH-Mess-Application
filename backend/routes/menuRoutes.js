const express = require('express');
const router = express.Router();
const { getCurrentMenu , getLastUpdatedTime , getCutoffMealTimings } = require('../controllers/menuController');

router.get('/current', getCurrentMenu);
router.get('/last-updated', getLastUpdatedTime);
router.get("/booking-Closetimings", getCutoffMealTimings);



module.exports = router;

