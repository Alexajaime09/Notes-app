const express = require("express");
const router = express.Router();
const notesController = require("./controller");

router.get("/notes", notesController.getAllNotes);
router.post("/notes", notesController.createNote);
router.delete("/notes/:id", notesController.deleteNote);
router.patch("/notes/:id", notesController.updateNote);

module.exports = router;
