const express = require("express");
const {
  get_all_user_accounts,
  get_user_details,
  delete_user,
  update_patch_user,
  update_put_user,
} = require("../controllers/user-account.controller");
const router = express.Router();


router.get("/all", get_all_user_accounts);

router.get("/:userId", get_user_details);

router.delete("/:userId", delete_user);

router.put("/:userId", update_put_user);

router.patch("/:userId", update_patch_user);

module.exports = { routes: router };
