const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectToDb() {
  try {
    await client.connect();
    db = client.db("users"); 
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}

function getDb() {
  if (!db) throw new Error("DB not initialized. Call connectToDb() first.");
  return db;
}

module.exports = { connectToDb, getDb };
