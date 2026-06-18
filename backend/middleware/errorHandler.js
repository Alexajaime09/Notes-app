const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  if (err.name === "MongoNetworkError" || err.code === 11000) {
    return res.status(503).json({
      error: "Service Unavailable",
      message: "Comunication Error with the data base",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
};

module.exports = errorHandler;
