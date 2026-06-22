const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: "fail",
    message:
      "Too many requests from this IP address, please try again in 15 minutes",
  },
  standarHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    status: "fail",
    message:
      "Too many login attempts. Locked for 15 minutes for security reasons",
  },
  standarHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter };
