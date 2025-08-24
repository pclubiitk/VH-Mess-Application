const jwt = require('jsonwebtoken');
const { User } = require('../config/database');

const protect = (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};


const isMe = async(req, res, next) => {
  try {
  
      const token = req.headers.authorization;
if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    //need to change this to process.env.JWT_SECRET
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   console.log(decoded);

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = {
      name: user.name,
      email: user.email,
      verified: user.verified
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};



module.exports = { protect ,isMe };

