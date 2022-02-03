const express = require("express");
const mongoose = require("mongoose");
const Event = mongoose.model("Event");
const User = mongoose.model("User");

const router = express.Router();

router.post("/createevent", async (req, res) => {
  const { title, sdate, edate, uri, members, payment } = req.body;
  try {
    const event = new Event({
      title,
      sdate,
      edate,
      uri,
      members,
      payment,
      amount: 0,
    });
    await event.save();
    res.send({ id: event._id });
  } catch (err) {
    return res.status(402).send(err.message);
  }
});

router.post("/addpay", async (req, res) => {
  const { _id, name, email, amount, reason } = req.body;
  if (!_id || !name || !amount || !email) {
    return res.status(402).send("Data must be provided...");
  }
  try {
    await Event.updateOne(
      { _id: _id },
      {
        $push: {
          payment: {
            $each: [{ name, email, amount, reason }],
            $position: 0,
          },
        },
        $inc: {
          amount: amount,
        },
      }
    );
    return res.send({ message: "Pay updated successfully" });
  } catch (err) {
    res.status(402).send(err.message);
  }
});

router.post("/addmem", async (req, res) => {
  const { _id, name, email } = req.body;
  if (!_id || !name || !email) {
    return res.status(402).send("Data must be provided...");
  }
  try {
    const event = await Event.findOne({ _id });
    event.members.push({ name, email });
    await event.save();
    return res.send({ message: "Member added successfully", event });
  } catch (err) {
    res.status(402).send(err.message);
  }
});

router.post("/addtrip", async (req, res) => {
  const { id, title, sdate, edate, email } = req.body;
  if (!id || !title || !sdate || !edate) {
    return res.status(402).send("Data must be provided...");
  }
  try {
    const user = await User.findOne({ email });
    user.trip.push({ id, title, sdate, edate });
    await user.save();
    return res.send({ message: "Trip added successfully" });
  } catch (err) {
    res.status(402).send(err.message);
  }
});

router.post("/fetchpay", async (req, res) => {
  const { eId, skip } = req.body;
  if (!eId) {
    return res.status(402).send("Data must be provided ...");
  }
  try {
    const data = await Event.findById(eId)
      .select("payment")
      .slice("payment", [skip, 10]);
    return res.send(data.payment);
  } catch (err) {
    return res.status(402).send(err.message);
  }
});

router.post("/fetchmem", async (req, res) => {
  const { eId } = req.body;
  if (!eId) {
    return res.status(402).send("Data must be provided ...");
  }
  try {
    const data = await Event.findById(eId).select("members");
    return res.send(data.members);
  } catch (err) {
    return res.status(402).send(err.message);
  }
});

router.post("/fetchamount", async (req, res) => {
  const { eId } = req.body;
  if (!eId) {
    return res.status(402).send("Data must be provided ...");
  }
  try {
    const data = await Event.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(eId) } },
      { $unwind: "$payment" },
      {
        $group: {
          _id: { email: "$payment.email", name: "$payment.name" },
          total: { $sum: "$payment.amount" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    return res.send(data);
  } catch (err) {
    return res.status(402).send(err.message);
  }
});

router.post("/fetchtotal", async (req, res) => {
  const { eId } = req.body;
  if (!eId) {
    return res.status(402).send("Data must be provided ...");
  }
  try {
    const data = await Event.findById(eId).select("amount");
    return res.send(data);
  } catch (err) {
    return res.status(402).send(err.message);
  }
});

module.exports = router;
