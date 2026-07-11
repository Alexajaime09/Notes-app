const express = require("express");

const { connectDB } = require("./db");
const noteRoutes = require("./router");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 9090;

const allowOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];

if (process.env.CLIENT_URL) {
  allowOrigins.push(process.env.CLIENT_URL);
}

app.use(express.json());
app.use(
  cors({
    origin(origin, callback) {
      console.log("Origin recibido:", origin);
      console.log("Permitidos:", allowOrigins);

      if (!origin) return callback(null, true);

      if (allowOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Origin not allowed"));
    },
  }),
);

app.get("/", (req, res) => {
  res.json({
    status: "Server runing",
  });
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
