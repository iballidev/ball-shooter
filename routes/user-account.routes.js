const express = require("express");
const {
  get_all_user_accounts,
  get_user_details,
  delete_user,
  update_patch_user,
  update_put_user,
  update_patch_user_score_point,
  update_patch_user_isOnline,
} = require("../controllers/user-account.controller");
const router = express.Router();


router.get("/all", get_all_user_accounts);

router.post("/score-point", update_patch_user_score_point);

router.post("is-online", update_patch_user_isOnline);

router.get("/:userId", get_user_details);

router.delete("/:userId", delete_user);

router.put("/:userId", update_put_user);

router.patch("/:userId", update_patch_user);


module.exports = { routes: router };
