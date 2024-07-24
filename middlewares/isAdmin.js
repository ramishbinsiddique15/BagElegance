const jwt = require("jsonwebtoken");
const ownerModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    if (!req.cookies.admin) {
        req.flash("error", "Please login to access this page");
        return res.redirect("/");
    }
    
    try {
        let decoded = jwt.verify(req.cookies.admin, process.env.JWT_KEY);
        let user = await ownerModel
        .findOne({ email: decoded.email })
        .select("-password");
        req.admin = user;
        next();
    } catch (err) {
        req.flash("error", "Something went wrong");
        return res.redirect("/");
    }
    }