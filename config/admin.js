const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/admin");
//const config = require('../config/database');
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/bnbapp");
module.exports = function(passport) {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      let query = { username: username };

      User.findOne(query, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        } else {
        }

        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            console.log(user);
            return done(null, user);
          } else {
            return done(null, false, { message: "Wrong Password ." });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
