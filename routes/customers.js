const express = require("express");
const { getDb } = require("../db");
const auth = require("../userToken/auth");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.use(auth);

router.post("/", async (req, res) => {
  const db = getDb();
  const { name, phone, trustScore } = req.body;
  if (!/^\d{10}$/.test(phone))
    return res.status(400).json({ error: "Invalid phone" });
  if (trustScore < 0 || trustScore > 100)
    return res.status(400).json({ error: "Invalid trust score" });
  console.log(req.user);
  try {
    await db
      .collection("customers")
      .insertOne({ userId: req.user.userId, name, phone, trustScore });
    res.status(201).json({ message: "Customer added successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  const db = getDb();
  const customers = await db
    .collection("customers")
    .find({ userId: req.user.userId })
    .toArray();
  res.json(customers);
});

router.put("/:id", async (req, res) => {
  const db = getDb();
  const { name, phone, trustScore } = req.body;
  await db.collection("customers").updateOne(
    {
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    },
    { $set: { name, phone, trustScore } }
  );
  res.json({ message: "Customer updated" });
});

router.delete("/:id", async (req, res) => {
  const db = getDb();
  await db.collection("customers").deleteOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.userId,
  });
  res.json({ message: "Customer deleted" });
});

module.exports = router;
