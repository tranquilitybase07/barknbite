let mongoose = require("mongoose");

//Article shcema
let productSchema = mongoose.Schema({
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
  stock: {
    type: Number,
    required: true
  },
  desp: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let Product = (module.exports = mongoose.model("Product", productSchema));
