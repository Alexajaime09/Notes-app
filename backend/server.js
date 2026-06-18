const express = require("express");
const { connectDB } = require("./db");
const noteRoutes = require("./router");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());

async function startServer() {
  try {
    await connectDB();

    app.use("/notes", noteRoutes);
    app.use(errorHandler);
    app.listen(PORT, () => {
      console.log(`"server running port ${PORT}"`);
    });
  } catch (err) {
    console.log("Failed to connect to DB", err.message);
    process.exit(1);
  }
}
startServer();
