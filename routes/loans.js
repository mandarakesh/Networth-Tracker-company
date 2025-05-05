const express = require("express");
const { getDb } = require("../db");
const auth = require("../userToken/auth");
const moment = require("moment");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.use(auth);

router.post("/", async (req, res) => {
  const db = getDb();
  const { customerId, amount, dueDate } = req.body;
  await db.collection("loans").insertOne({
    userId: req.user.userId,
    customerId,
    amount,
    dueDate,
    balance: amount,
    status: "pending",
    repayments: [],
  });
  res.status(201).json({ message: "Loan created" });
});

router.get("/", async (req, res) => {
  const db = getDb();
  const { status } = req.query;
  const filter = { userId: req.user.userId };
  if (status) filter.status = status;
  const loans = await db.collection("loans").find(filter).toArray();
  res.json(loans);
});

router.post("/:id/repay", async (req, res) => {
  const db = getDb();
  const { amount } = req.body;
  const loan = await db.collection("loans").findOne({
    _id: new ObjectId(req.params.id),
    userId: req.user.userId,
  });
  if (!loan) return res.status(404).json({ error: "Loan not found" });

  const newBalance = loan.balance - amount;
  const status = newBalance <= 0 ? "paid" : loan.status;
  if(newBalance>0){

    await db.collection("loans").updateOne(
      { _id: loan._id },
      {
        $push: { repayments: { amount, date: new Date() } },
        $set: { balance: newBalance, status },
      }
    );
    
    res.json({ message: "Repayment recorded" });
  }else{
    res.send("Loan already paid")
  }
});

router.get("/summary", async (req, res) => {
  const db = getDb();
  const loans = await db
    .collection("loans")
    .find({ userId: req.user.userId })
    .toArray();
  let totalLoaned = 0,
    totalCollected = 0,
    overdueAmount = 0;
  const now = moment();

  for (const loan of loans) {
    totalLoaned += loan.amount;
    totalCollected += loan.amount - loan.balance;
    if (loan.status === "pending" && moment(loan.dueDate).isBefore(now)) {
      overdueAmount += loan.balance;
      await db
        .collection("loans")
        .updateOne({ _id: loan._id }, { $set: { status: "overdue" } });
    }
  }

  res.json({ totalLoaned, totalCollected, overdueAmount });
});

router.get("/overdue", async (req, res) => {
  const db = getDb();
  const loans = await db
    .collection("loans")
    .find({ userId: req.user.userId, status: "overdue" })
    .toArray();
  res.json(loans);
});

module.exports = router;
