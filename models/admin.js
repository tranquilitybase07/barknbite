let mongoose = require("mongoose");

//Article shcema
let adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

});

let Admin = (module.exports = mongoose.model("Admin", adminSchema));
