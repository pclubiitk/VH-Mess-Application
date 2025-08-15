const express = require('express');
const { signup, signin ,verify} = require('../controllers/adminController');
const { isMe } = require('../middleware/authMiddleware');

const router = express.Router();




router.post('/signup', signup);
router.post('/sigin',  signin);
router.get('/verify', verify)
router.get('/me',isMe , (req, res) => {
  res.json({
 name: req.user.name,
    email: req.user.email,
    verified: req.user.verified
  });
});



module.exports = router;