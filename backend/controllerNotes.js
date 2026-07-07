const { getDB } = require("./db");
const { ObjectId } = require("mongodb");

const createNote = async (req, res, next) => {
  try {
    const { title, content, tags, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Bad request",
        message: "The title and content are required",
      });
    }
    const userId = new ObjectId(req.user.userId);

    const newNote = {
      title: title.trim().toLowerCase(),
      content: content.trim().toLowerCase(),
      tags: tags || [],
      isPinned: isPinned,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: userId,
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
    const userId = new ObjectId(req.user.userId);

    const { search, tags, page, limit } = req.query;
    console.log(req.query);
    const pageNum = Math.max(parseInt(page, 10) || 1);
    const limitNum = Math.max(parseInt(limit, 10) || 3);
    let skipNum = pageNum * limitNum - limitNum;

    let query = { userId: userId };

    let sortOptions = { isPinned: -1, createdAt: -1 };

    if (search) {
      query.$text = { $search: search };
      sortOptions = {
        isPinned: -1,
        score: { $meta: "textScore" },
        createdAt: -1,
      };
    }

    if (tags) {
      if (tags.includes(",")) {
        query.tags = { $in: tags.split(",") };
      } else {
        query.tags = tags;
      }
    }

    const [notes, totalNotes] = await Promise.all([
      db
        .collection("notes")
        .find(query, search ? { score: { $meta: "textScore" } } : {})
        .sort(sortOptions)
        .skip(skipNum)
        .limit(limitNum)
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

const updateNote = async (req, res, next) => {
  try {
    const db = getDB();
    const noteId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user.userId);

    console.log(userId, noteId);
    const { title, content, tags, isPinned } = req.body;

    let updateFields = {};

    if (title !== undefined) updateFields.title = title.trim().toLowerCase();
    if (content !== undefined)
      updateFields.content = content.trim().toLowerCase();
    if (isPinned !== undefined) updateFields.isPinned = isPinned;

    if (tags !== undefined) {
      updateFields.tags =
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim().toLowerCase())
          : tags;
    }

    updateFields.updateAt = new Date();

    const result = await db
      .collection("notes")
      .findOneAndUpdate(
        { _id: noteId, userId: userId },
        { $set: updateFields },
        { ReturnDocument: "after" },
      );

    if (!result) {
      return res.status(404).json({
        error: "Not found",
        message: "Note not found or you don't have permision to edit it",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Note updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const db = getDB();
    const noteId = new ObjectId(req.params.id);
    const userId = new ObjectId(req.user.userId);
    console.log(userId, noteId);
    const result = await db
      .collection("notes")
      .deleteOne({ _id: noteId, userId: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Not found",
        message: "Note not found or you don't have permission to delete it",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Note deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
