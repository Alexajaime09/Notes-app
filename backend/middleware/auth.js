const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Token not valid",
    });
  }

  const token = authHeader.split(" ")[1];

  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded, "soy decode");
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Token expired or invalid",
    });
  }
};

module.exports = verifyJWT;
