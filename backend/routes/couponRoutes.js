const express = require('express');
const router = express.Router();
const { initiateOrder, resetAvailableCoupons} = require('../controllers/couponController');

router.post('/initiate-order', initiateOrder);
router.get('/reset-available-coupons', resetAvailableCoupons);

// router.post('/payment/webhook', confirmPayment);


module.exports = router;

