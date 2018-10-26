let mongoose = require("mongoose");

//Article shcema
let disSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  per: {
    type: Number,
    required: true
  }
});

let Dis = (module.exports = mongoose.model("Dis", disSchema));
