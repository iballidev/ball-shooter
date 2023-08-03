const express = require("express");
const {
  signup_user,
  signup_user_view,
} = require("../controllers/signup.controller");
const router = express.Router();

router.get("/", signup_user_view);
router.post("/", signup_user);

/** 
 * We can export like this: module.exports = router
 * OR like this: module.exports = {
                        routes: router
                    }
 * */
module.exports = {
  routes: router,
};
