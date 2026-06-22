const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
});
let dbConnection = null;
async function connectDB() {
  try {
    await client.connect();
    let dbName = process.env.MONGO_DB_NAME || "notes-app";
    dbConnection = client.db(dbName);
    console.log(`mongo db connect to ${process.env.MONGO_DB_NAME}`);

    await dbConnection
      .collection("notes")
      .createIndex({ title: "text", content: "text" });
  } catch (err) {
    throw err;
  }
}

function getDB() {
  if (!dbConnection) {
    throw new Error("the data base hasn't been initialized'");
  }
  return dbConnection;
}
module.exports = { connectDB, getDB };
