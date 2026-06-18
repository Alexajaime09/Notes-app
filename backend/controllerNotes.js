const { getDB } = require("./db");
const { ObjectId } = require("mongodb");

const createNote = async (req, res, next) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Bad request",
        message: "The title and content are required",
      });
    }
    const userId = req.user.id;

    const newNote = {
      title: title.trim().toLowerCase(),
      content: content.trim().toLowerCase(),
      tags: tags || [],
      isPinned: false,
      createdAt: new Date(),
      updateCreated: new Date(),
    };
    const db = getDB();
    const result = await db.collection("notes").insertOne(newNote);
    return res.status(201).json({
      message: "Note created successfully",
      noteId: result.insertedId,
      note: newNote,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote };
