const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getDB } = require("./db");
require("dotenv").config();

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "The user and password are required",
      });
    }

    const db = getDB();

    const user = await db
      .collection("users")
      .findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({
        error: "Credentials invalid",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid, "es validacion");
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credentials invalid" });
    }

    const payload = { userId: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      message: "Successful login.",
      token: token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser };
