let mongoose = require("mongoose");

//Article shcema
let orderSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  oid: {
    type: String,
    required: true
  },
  proid: {
    type: Array,
    required: true
  },
  name: {
    type: Array,
    required: true
  },
  qty: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  add1: {
    type: String,
    required: true
  },
  add2: {
    type: String,
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  pno: {
    type: Number,
    required: true
  },
  stat: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let Order = (module.exports = mongoose.model("Order", orderSchema));
