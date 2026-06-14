const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
});
let dbConnection;
async function connectDB() {
  try {
    await client.connect();
    dbConnection = client.db(process.env.MONGO_DB_NAME);
    console.log(`mongo db connect to ${process.env.MONGO_DB_NAME}`);
    return dbConnection;
  } catch (err) {
    throw err;
  }
}

function getDB() {
  return dbConnection;
}
module.exports = { connectDB, getDB };
