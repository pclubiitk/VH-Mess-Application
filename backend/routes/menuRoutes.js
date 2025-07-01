const express = require('express');
const router = express.Router();
const { getCurrentMenu } = require('../controllers/menuController');

router.get('/current', getCurrentMenu);

module.exports = router;

