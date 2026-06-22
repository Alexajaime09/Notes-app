const { getDB } = require("./db");
const { ObjectId } = require("mongodb");

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

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

const getNotes = async (req, res, next) => {
  try {
    const db = getDB();
    const userId = req.user.userId;

    const { search, tags, page = 1, limit = 5 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skipNum = page * limit - limit;

    const query = { userId: Number(userId) };

    if (search) {
      query.$text = { $search: search };
    }
    if (tags) {
      query.tags = tags;
    }

    const [notes, totalNotes] = await Promise.all([
      db
        .collection("notes")
        .find(query)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skipNum)
        .toArray(),
      db.collection("notes").countDocuments(query),
    ]);
    console.log(notes);
    res.status(200).json({
      status: "success",
      results: notes.length,
      pagination: {
        totalItems: totalNotes,
        totalPages: Math.ceil(totalNotes / limitNum),
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getNotes };
