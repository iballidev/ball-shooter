const express = require("express");
const {
  login_user,
  signup_user,
  refresh_token,
  login_user_view,
} = require("../controllers/auth.controller");
const router = express.Router();

router.get("/", login_user_view);
router.post("/", login_user);
// router.post("/signup", signup_user);

module.exports = { routes: router };
