const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", isNotLoggedIn , (req, res) => {
  let error = req.flash("error");
  let success = req.flash("success");
  res.render("index", { error, success ,loggedin: false });
});

router.get("/shop", isLoggedIn, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  let error = req.flash("error");
  res.render("shop", { products, success, error});
});

router.get("/add-to-cart/:id", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let product = await productModel.findById(req.params.id);

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/shop");
    }

    if (product.quantity <= 0) {
      req.flash("error", "Product out of stock");
      return res.redirect("/shop");
    }

    let item = user.cart.find(item => item.product.toString() === req.params.id);
    if (item) {
      req.flash("error", "Product already in cart");
      return res.redirect("/shop");
    }

    user.cart.push({ product: req.params.id, quantity: 1 });
    product.quantity -= 1;

    await product.save();
    await user.save();
    
    req.flash("success", "Product added to cart");
    res.redirect("/shop");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/shop");
  }
});

router.get("/cart", isLoggedIn, async (req, res) => {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate('cart.product');

  let bill = 0, price = 0, discount = 0, platform = 0;
  user.cart.forEach(item => {
    let totalPrice = item.product.price * item.quantity;
    let totalDiscount = item.product.discount * item.quantity;
    bill += (totalPrice + 20) - totalDiscount;
    price += totalPrice;
    discount += totalDiscount;
    platform += 20;
  });

  let success = req.flash("success");
  let error = req.flash("error");
  res.render("cart", { success, error, user, bill, price, discount, platform });
});

router.post("/cart/increment/:id", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let item = user.cart.find(item => item.product._id.equals(req.params.id));
    let product = await productModel.findById(req.params.id);

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/cart");
    }

    if (product.quantity <= 0) {
      req.flash("error", "Product out of stock");
      return res.redirect("/cart");
    }

    item.quantity += 1;
    product.quantity -= 1;

    await user.save();
    await product.save();

    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});


router.post("/cart/decrement/:id", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let item = user.cart.find(item => item.product._id.equals(req.params.id));
    let product = await productModel.findById(req.params.id);

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/cart");
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
      product.quantity += 1;
    } else {
      user.cart = user.cart.filter(item => !item.product._id.equals(req.params.id));
      product.quantity += item.quantity;
    }

    await user.save();
    await product.save();

    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});



router.get("/delete/:id", isLoggedIn, async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    let item = user.cart.find(item => item.product._id.equals(req.params.id));
    
    if (!item) {
      req.flash("error", "Product not found in cart");
      return res.redirect("/cart");
    }
    
    let product = await productModel.findById(req.params.id);

    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/cart");
    }

    // Return the quantity to the product model
    product.quantity += item.quantity;

    // Remove the item from the cart
    user.cart.pull(item._id);

    await product.save();
    await user.save();

    req.flash("error", "Product removed from cart");
    res.redirect("/cart");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/cart");
  }
});

module.exports = router;


module.exports = router;
