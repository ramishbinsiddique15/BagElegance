const userModel = require("../models/user-model");
const tempUserModel = require("../models/tempUser-model");
const ownerModel = require("../models/owner-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.registerUser = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "Account already exists, please login");
      return res.redirect("/");
    }

    const tempUser = await tempUserModel.findOne({ email });
    if (tempUser) {
      req.flash(
        "error",
        "A verification email has already been sent. Please check your email."
      );
      return res.redirect("/");
    }

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await tempUserModel.create({
      fullname,
      email,
      password: hash,
      verificationToken,
    });

    const verificationUrl = `${process.env.BASE_URL}/users/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `<p>Please click the following link to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending verification email");
      }

      
      req.flash("success", "Verification email sent. Please check your email.");
      res.redirect("/");
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const tempUser = await tempUserModel.findOne({ verificationToken: token });
    if (!tempUser) {
      return res.status(400).send("Invalid verification link");
    }

    const newUser = await userModel.create({
      fullname: tempUser.fullname,
      email: tempUser.email,
      password: tempUser.password,
      isVerified: true,
    });

    await tempUserModel.deleteOne({ _id: tempUser._id });

    res.redirect("/");
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.checkYourEmail = (req, res) => {
  res.render("check-your-email"); // This will render a view named 'check-your-email'
};

module.exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/");
    }

    bcryptjs.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
      } else {
        req.flash("error", "Invalid email or password");
        return res.redirect("/");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("admin");
  res.redirect("/");
};

module.exports.loginAdmin = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await ownerModel.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/");
    }
    bcryptjs.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("admin", token);
        res.redirect("/owners/admin");
      } else {
        res.status(401).send("Invalid email or password");
      }
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.logoutAdmin = (req, res) => {
  res.clearCookie("admin");
  res.redirect("/");
};
