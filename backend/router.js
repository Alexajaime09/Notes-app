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
router.post("/createNote", createNote);
router.get("/", getNotes);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
