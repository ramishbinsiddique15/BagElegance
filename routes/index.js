const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", isNotLoggedIn , (req, res) => {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("shop", { products, success, error});
});

router.get("/add-to-cart/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  if (user.cart.includes(req.params.id)) {
    req.flash("error", "Product already in cart");
    return res.redirect("/shop");
  }
  user.cart.push(req.params.id);
  await user.save();
  req.flash("success", "Product added to cart");
  res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");
    let bill=0,price=0,discount=0, platform=0;
  user.cart.forEach((product) => {
    bill += Number(product.price + 20) - Number(product.discount);
    price+=product.price;
    discount+=product.discount;
    platform+=20;
  });
  
  res.render("cart", { user, bill,price,discount,platform });
});

router.get("/delete/:id", isLoggedIn, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.pull(req.params.id);
  await user.save();
  res.redirect("/cart");
});

module.exports = router;
