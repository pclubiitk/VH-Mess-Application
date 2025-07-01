const express = require('express');
const router = express.Router();
import {PaymentController,CreateorderController} from '../controllers/paymentController.js';

router.post('/verify-payment',PaymentController );
router.post('/create-order', CreateorderController); 

module.exports = router;