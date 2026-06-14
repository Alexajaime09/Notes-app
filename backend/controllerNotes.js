const { getDB } = require("./db");
const { ObjectId } = require("mongodb");

const db = getDB();
const Notes = db.collection("notes");
