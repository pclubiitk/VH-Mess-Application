const { sendmail } = require("../utilities/mail");
const { BASE_URL, VERIFIED_URL } = require("../config/constant");
const { User } = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      verified: false,
    });

    const token = jwt.sign(
      { name: name, email: email, verified: false },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await sendmail(
      email,
      "Welcome to VH Mess",
      `Click to verify: ${BASE_URL}/api/user/verify?token=${token}`
    );

    return res.status(201).json({
      message:
        "Signup successful. Please check your email and complete the verification before booking.",
      status: true,
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", status: false });
  }
};
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "Signin successful", status: true, token: token });
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
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`${VERIFIED_URL}`);
    res.json({ message: "Email verified successfully", token: newToken });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  verify,
  signin,
  signup,
};
