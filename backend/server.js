const express = require("express");
const path = require("path");
const { connectDB } = require("./db");
const noteRoutes = require("./router");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    res.set(`Access-Control-Allow-Headers`, "Content-Type, Authorization");
    return res.sendStatus(204);
  }
  next();
});

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
