const express = require("express");
const router = express.Router();
const {registerUser, loginUser, logout, verifyEmail} = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("Users route");
});

router.post("/register", registerUser );

router.get('/verify/:token', verifyEmail);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports = router;
