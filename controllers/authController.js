const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async (req, res) => {
  try {
    let { fullname, email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user){
      req.flash("error", "Account already exists, please login");
    return res.redirect("/");
  }
    bcryptjs.genSalt(10, function (err, salt) {
      bcryptjs.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });
          let token = generateToken(user);
          res.cookie("token", token);
          res.redirect("/shop");
        }
      });
    });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports.loginUser = async(req,res)=>{
  try{
    let {email, password} = req.body;
    let user = await userModel.findOne({email: email});
    if(!user) {
      req.flash("error", "Invalid email or password");
      return res.redirect("/");
    }

    bcryptjs.compare(password, user.password, (err, result)=>{
      if(result){
        let token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/shop");
      }
      else{
        res.status(401).send("Invalid email or password");
      }
    });
  }
  catch(err){
    res.send(err.message);
  }
}

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
}

module.exports.logoutAdmin = (req, res) => {
  res.clearCookie("admin");
  res.redirect("/");
}
