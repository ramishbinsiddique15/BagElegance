const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    let { name, price, discount, bgcolor, panelcolor, textcolor, quantity } = req.body;
    let product = await productModel.create({
      image: req.file.buffer,
      name,
      price,
      discount,
      bgcolor,
      panelcolor,
      textcolor,
      quantity: quantity || 1, // Default to 1 if not provided
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/edit/:id", upload.single("image"), async (req, res) => {
  let { id } = req.params;
  let { name, price, discount, bgcolor, panelcolor, textcolor, quantity } = req.body;
  let product = await productModel.findById(id);
  product.name = name;
  product.price = price;
  product.discount = discount;
  product.bgcolor = bgcolor;
  product.panelcolor = panelcolor;
  product.textcolor = textcolor;
  product.quantity = quantity || 1; // Default to 1 if not provided
  if (req.file) {
    product.image = req.file.buffer;
  }
  await product.save();
  req.flash("success", "Product updated successfully");
  res.redirect("/owners/products");
});


module.exports = router;
