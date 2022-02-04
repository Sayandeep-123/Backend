const mongoose = require("mongoose");

const paySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: false,
  },
});

const memSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    sparse: true,
  },
});

const eventSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  sdate: {
    type: Number,
    required: true,
  },
  edate: {
    type: Number,
    required: true,
  },
  uri: {
    type: String,
    required: false,
  },
  members: {
    type: [memSchema],
    required: false,
    sparse: true,
  },
  payment: {
    type: [paySchema],
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
});

mongoose.model("Event", eventSchema);
