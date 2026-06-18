const express = require("express");
const router = express.Router();
const { registerUser } = require("./registerUser");
const { loginUser } = require("./loginUser");

const {
  createNote,
  getAllNotes,
  deleteNote,
  updateNote,
} = require("./controllerNotes");

const verifyJWT = require("./middleware/auth");

//router.get("/notes",getAllNotes);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/createNote", verifyJWT, createNote);

//router.delete("/notes/:id",deleteNote);
//router.patch("/notes/:id", updateNote);

module.exports = router;
