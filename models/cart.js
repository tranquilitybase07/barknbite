let mongoose = require("mongoose");

//Article shcema
let cartSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  proid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cat: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  qty: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let Cart = (module.exports = mongoose.model("Cart", cartSchema));
