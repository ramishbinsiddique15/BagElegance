const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");
const productModel = require("../models/product-model");
const { loginAdmin, logoutAdmin } = require("../controllers/authController");
const bcryptjs = require("bcryptjs");
const isAdmin = require("../middlewares/isAdmin");

router.post("/create", async (req, res) => {
  let owners = await ownerModel.find();
  if (owners.length > 0) {
    return res
      .status(500)
      .send("You don't have permission to create a new owner");
  }
  let { fullname, email, password } = req.body;
  bcryptjs.genSalt(10, function (err, salt) {
    bcryptjs.hash(password, salt, async function (err, hash) {
      if (err) return res.send(err.message);
      else {
        let createdOwner = await ownerModel.create({
          fullname,
          email,
          password: hash,
        });

        res.status(201).send(createdOwner);
      }
    });
  });
});

router.get("/admin", isAdmin, (req, res) => {
  let success = req.flash("success");
  res.render("createproduct", { success, loggedin: false, admin: true });
});

router.post("/login", loginAdmin);

router.get("/logout", logoutAdmin);

router.get("/products" , isAdmin, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("products", {success, products, loggedin: false, admin: true });
});

router.get("/delete/:id", isAdmin, async (req, res) => {
  let { id } = req.params;
  await productModel.findByIdAndDelete(id);
  res.redirect("/owners/products");
});

router.get("/edit/:id", isAdmin, async (req, res) => {
  let { id } = req.params;
  let product = await productModel.findById(id);
  res.render("editproduct", { product, loggedin: false, admin: true });
});

module.exports = router;
