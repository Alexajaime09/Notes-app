const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const cors = require("cors");
const { connectDB } = require("./db");

async function startServer() {
  try {
    await connectDB();
    const server = app.listen(3000, () => {
      console.log("server running port 3000");
    });
  } catch (err) {
    console.log("failed to connect", err.message);
  }
}
startServer();
