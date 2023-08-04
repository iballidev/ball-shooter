const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyJWT = async (req, res, next) => {
  if (!req.session.accessToken) return res.redirect("/auth");
  const authHeader = req.session.accessToken; //Bearer token

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

    if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"

    req.user = decoded.userInfo.email;
    req.userId = decoded.userInfo._id;
    req.roles = decoded.userInfo.roles;
    req.session.user = decoded;
    res.locals.user = req.session.user?.userInfo;

    if (decoded.exp * 1000 < new Date().getTime()) {
      res.locals.isLoggedIn = false;
    }
    res.locals.isLoggedIn = true;
    
    next();
  });
};

module.exports = verifyJWT;
