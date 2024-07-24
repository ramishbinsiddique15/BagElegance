module.exports = async (req, res, next) => {
    if(!req.cookies.token)
    next();
    else{
        res.redirect("/shop");
    }
};