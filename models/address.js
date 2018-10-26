let mongoose = require("mongoose");

//Article shcema

let AddressSchema = mongoose.Schema({
  email: {
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
  add1: {
    type: String,
    required: true
  },
  add2: {
    type: String,
    required: false
  },
  cont: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pin: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let Address = (module.exports = mongoose.model("Address", AddressSchema));
