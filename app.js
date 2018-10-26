const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const date = require("date-and-time");
const multer = require("multer");

const app = express();

mongoose.connect("mongodb://localhost:27017/bnbapp");
let db = mongoose.connection;

//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//check connection

db.once("open", function() {
  console.log("Connected To Mongoose MKC");
});

//check for connection

db.on("error", function(err) {
  console.log(err);
});

//View Engine
app.engine("ejs", require("express-ejs-extend"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//static path
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middelware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Express Message Middelware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//MODELS
let Signup = require("./models/signup");
let Product = require("./models/product");
let Address = require("./models/address");
let Cart = require("./models/cart");
let Wish = require("./models/wishlist");
let Order = require("./models/order");
let Admin = require("./models/admin");

require("./config/passport")(passport);

// PASSPOST MIDDEL WARE

app.use(passport.initialize());
app.use(passport.session());

// loGIN route
app.post("/login", function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

app.all("*", function(req, res, next) {
  res.locals.user = req.user || null;
  if (req.user) {
    Cart.find({ email: req.user.email }, (err, cart) => {
      if (err) {
        console.log(err);
      } else {
        res.locals.cartlen = cart.length || null;
        res.locals.carttot = cart.total || null;
      }
    });
  } else {
    res.locals.cart = null;
  }

  next();
});

app.get("/logout", function(req, res) {
  req.logout();
  req.flash("success", "You are logged out !");
  res.redirect("/");
});

app.get("/", (req, res) => {
  res.render("index");
});

//Login Routes

// FOR ALLLLLLLLLLLLLl

app.get("/signup", (req, res) => {
  res.render("signup");
});

//signup route
app.post("/signup", (req, res) => {
  let NewUser = new Signup({
    email: req.body.email,
    pass1: req.body.pass1,
    pass2: req.body.pass2,
    fname: req.body.fname,
    lname: req.body.lname,
    pno: req.body.pno,
    add1: req.body.add1,
    add2: req.body.add2,
    cont: req.body.cont,
    state: req.body.state,
    pin: req.body.pin
  });

  let NewAdd = new Address({
    email: req.body.email,
    fname: req.body.fname,
    lname: req.body.lname,
    pno: req.body.pno,
    add1: req.body.add1,
    add2: req.body.add2,
    cont: req.body.cont,
    state: req.body.state,
    pin: req.body.pin
  });

  if (req.body.pass1 == req.body.pass2) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(NewUser.pass1, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        NewUser.pass1 = hash;
        console.log(NewUser.pass1);
        NewUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            NewAdd.save(function(err) {
              if (err) {
                console.log(err);
                return;
              } else {
                req.flash(
                  "success",
                  "You Registered Succesfully Now You Can Login"
                );
              }
            });

            res.redirect("/signup");
          }
        });
      });
    });
  } else {
    req.flash("danger", "Password Do Not Match !");
    res.redirect("/signup");
  }
});

//GET PRODUCT

app.get("/product/:id", (req, res) => {
  let id = req.params.id;
  Product.findById(id, (err, pro) => {
    if (err) {
      console.log(err);
    } else {
      res.render("product", {
        pro: pro
      });
    }
  });
});

// ADD PRODUCT

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});

var upload = multer({ storage: storage }).single("imgpro");

app.get("/admin/xyz/sandeep/barknbite/@1234/5678/add/product", (req, res) => {
  res.render("add-pro");
});

app.post(
  "/admin/xyz/sandeep/barknbite/@1234/5678/add/product",
  upload,
  (req, res) => {
    let Pro = new Product({
      name: req.body.name,
      cat: req.body.cat,
      price: req.body.price,
      img: req.file.filename,
      stock: req.body.stock,
      brand: req.body.brand,
      desp: req.body.desp
    });

    Pro.save((err, rep) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Product Added Succesfully !");
        res.redirect("/admin/xyz/sandeep/barknbite/@1234/5678/add/product");
      }
    });
  }
);

//VIEW CATEGORY
app.get("/view/food", (req, res) => {
  let que = { cat: "Food" };
  Product.find(que, (err, ls) => {
    if (err) {
      console.log(err);
    } else {
      res.render("view", {
        ls: ls,
        type: "Food"
      });
    }
  });
});

//LOGIN
app.get("/login", (req, res) => {
  res.render("login");
});

//Addresss
app.get("/address", ensureAuth, (req, res) => {
  Address.findOne({ email: req.user.email }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(addr);
      res.render("address", {
        add: addr
      });
    }
  });
});

//wishlist
app.get("/wishlist", ensureAuth, (req, res) => {
  Wish.find({ email: req.user.email }, (err, wis) => {
    res.render("wishlist", {
      wish: wis
    });
  });
});

//deleteing wish

app.post("/wishlist/del/:id", (req, res) => {
  Wish.remove({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash("warning", "Wish Deleted !");
      res.redirect("/wishlist");
    }
  });
});

//orders

app.get("/orders", ensureAuth, (req, res) => {
  Order.find({ email: req.user.email })
    .sort([["date", -1]])
    .exec(function(err, ord) {
      if (err) {
        console.log(err);
      } else {
        res.render("orders", {
          order: ord
        });
      }
    });
});

//account settings

app.get("/account", ensureAuth, (req, res) => {
  Signup.findById(req.user._id, (err, add) => {
    if (err) {
      console.log(err);
    } else {
      res.render("account", {
        add: add
      });
    }
  });
});

app.post("/account", ensureAuth, (req, res) => {
  if (req.body.newpass1 == req.body.newpass2) {
    bcrypt.compare(req.body.currpass, req.user.pass1, function(err, isMatch) {
      if (err) throw err;
      if (isMatch) {
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.newpass1, salt, function(err, hash) {
            if (err) {
              console.log(err);
            } else {
              let article = {};
              article.pass1 = hash;

              let query = { _id: req.user._id };
              Signup.update(query, article, function(err) {
                if (err) {
                  console.log(err);
                  return;
                } else {
                  req.flash("primary", "Password Updated");
                  console.log("password updated");
                  res.redirect("/account");
                }
              });
            }
          });
        });
      } else {
        return done(null, false, { message: "Wrong Password ." });
      }
    });
  } else {
    req.flash("danger", "New Password Do Not Match !");
    res.redirect("/account");
  }
});

//updat address
app.post("/update-address/:id", ensureAuth, (req, res) => {
  let idre = req.params.id;
  let article = {};
  article.fname = req.body.fname;
  article.lname = req.body.lname;
  article.pno = req.body.pno;
  article.add1 = req.body.add1;
  article.add2 = req.body.add2;
  article.pin = req.body.pin;

  let query = { email: req.user.email };
  Address.update(query, article, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      if (idre == "chk") {
        req.flash("primary", "Address Updated, Checkout Again ");
        // res.redirect(307, "/checkout");
        res.redirect("/cart");
      } else {
        req.flash("primary", "Address Updated");
        res.redirect("/update-address/" + idre);
      }
    }
  });
  // res.send(article);
});

app.get("/update-address/:id", ensureAuth, (req, res) => {
  Address.findOne({ email: req.user.email }, (err, addrr) => {
    if (err) {
      console.log(err);
    } else {
      console.log(addrr);
      res.render("update-address", {
        add: addrr
      });
    }
  });
});

//add to cart

app.post("/cart/:id", ensureAuth, (req, res) => {
  Product.findById(req.params.id, (err, pro) => {
    if (err) {
      console.log(err);
    } else {
      let qt = req.body.qqty;
      let tot = qt * pro.price;
      let Addto = new Cart({
        email: req.user.email,
        proid: req.params.id,
        name: pro.name,
        cat: pro.cat,
        price: pro.price,
        img: pro.img,
        brand: pro.brand,
        total: tot,
        qty: req.body.qqty
      });
      Addto.save((err, re) => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Added To Cart !");
          res.redirect("/product/" + req.params.id);
        }
      });
    }
  });
});

//Add wish list

app.post("/wishlist/:id", (req, res) => {
  let pid = req.params.id;
  Product.findOne({ _id: pid }, (err, rpro) => {
    if (err) {
      console.log(err);
    } else {
      let wish = new Wish({
        proid: pid,
        email: req.user.email,
        name: rpro.name,
        img: rpro.img
      });
      wish.save(err => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Added To Wishlist !");
          res.redirect("/product/" + req.params.id);
        }
      });
    }
  });
});

// Ensure auth
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "You Are Not Logged In !!");
    res.redirect("/login");
  }
}

//cart

app.get("/cart", ensureAuth, (req, res) => {
  Cart.find({ email: req.user.email }, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      var sum = 0;
      for (var i = 0; i < cart.length; i++) {
        sum = sum + cart[i].total;
      }
      res.render("cart", {
        cart: cart,
        sum: sum,
        total: sum,
        cop: 0
      });
    }
  });
});

//apply coupon
app.post("/dis/cart", ensureAuth, (req, res) => {
  Cart.find({ email: req.user.email }, (err, cart) => {
    if (err) {
      console.log(err);
    } else {
      if (req.body.disc == "BNB10") {
        var sum = 0;
        for (var i = 0; i < cart.length; i++) {
          sum = sum + cart[i].total;
        }
        var disfac = 0.1 * sum;
        var dis = sum - disfac;
        req.flash("success", "Coupon Applied Succesfully !");
        res.render("cart", {
          cart: cart,
          sum: sum,
          total: dis,
          cop: 1
        });
      } else {
        req.flash("warning", "No Coupon Found !");
        res.redirect("/cart");
      }
    }
  });
});

//delete cart item
app.post("/cart/del/:id", (req, res) => {
  Cart.remove({ _id: req.params.id }, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash("warning", "Item Deleted Deleted !");
      res.redirect("/cart");
    }
  });
});

//cart checkout

app.post("/checkout", ensureAuth, (req, res) => {
  Address.findOne({ email: req.user.email }, (err, addr) => {
    if (err) {
      console.log(err);
    } else {
      Cart.find({ email: req.user.email }, (err, cart) => {
        if (err) {
          console.log(err);
        } else {
          console.log(req.body.total);
          res.render("checkout", {
            cart: cart,
            add: addr,
            total: req.body.total,
            cop: req.body.cop
          });
        }
      });
    }
  });
});

//orders
app.get("/check/gen", (req, res) => {
  // let now = new Date();
  // var dtx = date.format(now, "dd-YYYY-MM-DD-mm-ss");
  bcrypt.genSalt(10, function(err, salt) {
    res.send(salt);
  });
  //res.send(dtx);
});

app.post("/place/order", (req, res) => {
  let now = new Date();
  var dtx = date.format(now, "dd-YYYY-MM-DD-mm-ss");
  let neword = new Order({
    email: req.user.email,
    oid: dtx,
    name: req.body.name,
    proid: req.body.proid,
    qty: req.body.qty,
    total: req.body.total,
    add1: req.body.add1,
    add2: req.body.add2,
    pno: req.body.pno,
    fname: req.body.fname,
    lname: req.body.lname
  });
  neword.save(err => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Order Placed Succesfully  !");
      res.redirect("/orders");
    }
  });
});

// Admin Section Starts here

app.get("/admin/login", (req, res) => {
  res.render("admin-login");
});

app.post("/admin/login", (req, res) => {
  Admin.findOne({ username: req.body.username }, (err, adm) => {
    if (err) {
      console.log(err);
    } else {
      let dbpasword = adm.password.toString();
      let userpass = req.body.password.toString();
      if (dbpasword == userpass) {
        res.send(adm);
      } else {
        res.send("No password match");
      }
    }
  });
});

app.get("/admin/xyz/sandeep/barknbite/@1234/5678", (req, res) => {
  res.render("main");
});

app.get("/admin/xyz/sandeep/barknbite/@1234/5678/product", (req, res) => {
  Product.find({}, (err, allpro) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin-prod", {
        allpro: allpro
      });
    }
  });
});

app.get("/admin/xyz/sandeep/barknbite/@1234/5678/edit/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, allpro) => {
    if (err) {
      console.log(err);
    } else {
      res.render("admin-update", {
        allpro: allpro,
        back: req.params.id
      });
    }
  });
});

//del pro
app.get(
  "/admin/xyz/sandeep/barknbite/@1234/5678/del/product/:id",
  (req, res) => {
    Product.remove({ _id: req.params.id }, err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("danger", "Product Deleted Succesfully  !");
        res.redirect("/admin/xyz/sandeep/barknbite/@1234/5678/product");
      }
    });
  }
);

//update product

app.post("/admin/xyz/sandeep/barknbite/@1234/5678/edit/:id", (req, res) => {
  let pro = {};
  pro.name = req.body.name;
  pro.price = req.body.price;
  pro.brand = req.body.brand;
  pro.cat = req.body.cat;
  Product.update({ _id: req.params.id }, pro, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Product Updated Succesfully  !");
      res.redirect(
        "/admin/xyz/sandeep/barknbite/@1234/5678/edit/" + req.params.id
      );
    }
  });
});

// adim orders
app.get("/admin/xyz/sandeep/barknbite/@1234/5678/orders", (req, res) => {
  Order.find({ stat: 0 }, (err, allor) => {
    if (err) {
      console.log(err);
    } else {
      console.log(allor);
      res.render("admin-order", {
        allor: allor
      });
    }
  });
});

app.get(
  "/admin/xyz/sandeep/barknbite/@1234/5678/orders/complete",
  (req, res) => {
    Order.find({ stat: 1 }, (err, allor) => {
      if (err) {
        console.log(err);
      } else {
        console.log(allor);
        res.render("comp-order", {
          allor: allor
        });
      }
    });
  }
);

app.get(
  "/admin/xyz/sandeep/barknbite/@1234/5678/orders/edit/:id",
  (req, res) => {
    Order.findOne({ _id: req.params.id }, (err, alled) => {
      if (err) {
        console.log(err);
      } else {
        console.log(alled);
        res.render("admin-order-det", {
          alled: alled
        });
      }
    });
  }
);

app.get(
  "/admin/xyz/sandeep/barknbite/@1234/5678/orders/check/:id",
  (req, res) => {
    Order.update({ _id: req.params.id }, { stat: 1 }, err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Delivered Succesfully  !");
        res.redirect("/admin/xyz/sandeep/barknbite/@1234/5678/orders/");
      }
    });
  }
);

//LISTEN
app.listen(3000, () => {
  console.log("Connected To Port 3000");
});
