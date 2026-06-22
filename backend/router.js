const express = require("express");
const router = express.Router();
const { registerUser } = require("./registerUser");
const { loginUser } = require("./loginUser");

const {
  createNote,
  getNotes,
  deleteNote,
  updateNote,
} = require("./controllerNotes");

const verifyJWT = require("./middleware/auth");
const { apiLimiter } = require("./middleware/rateLimiter");

router.use(apiLimiter);

//router.get("/notes",getAllNotes);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.use(verifyJWT);
router.post("/createNote", verifyJWT, createNote);
router.get("/", getNotes);

//router.delete("/notes/:id",deleteNote);
//router.patch("/notes/:id", updateNote);

module.exports = router;
