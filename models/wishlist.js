let mongoose = require("mongoose");

//Article shcema
let wishSchema = mongoose.Schema({
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
  img: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

let Wish = (module.exports = mongoose.model("Wish", wishSchema));
