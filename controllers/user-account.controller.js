const UserAccount = require("../models/user-account.model");
const mongoose = require("mongoose");

exports.get_all_user_accounts = async (req, res) => {
  let pageNumber = parseInt(req.query.pageNumber) - 1 || 0;
  let pageSize = parseInt(req.query.pageSize) || 10;
  try {
    let count = await UserAccount.count();
    let userAccountList = await UserAccount.find().select("email")
    .skip(pageNumber * pageSize)
    .limit(pageSize);

    // if (!userAccountList.length) {
    //   res.status(200).json({
    //     message: "User account list",
    //     userAccounts: userAccountList,
    //   });
    // }
    res.status(200).json({
      message: "User account list",
      count: count,
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      userAccounts: userAccountList,
    });
  } catch (error) {
    if (error) {
      console.log("error: ", error);
      res.status(500).json({
        error: error,
      });
    }
  }
};

exports.get_user_details = (req, res) => {
  const userId = req.params.userId;
  res.send("GET user with Id: " + userId);
};

exports.delete_user = (req, res) => {
  const userId = req.params.userId;
  res.send("DELETE user with Id: " + userId);
};

exports.update_put_user = (req, res) => {
  const userId = req.params.userId;
  res.send("UPDATE(PUT) user with Id: " + userId);
};

exports.update_patch_user = (req, res) => {
  const userId = req.params.userId;
  res.send("UPDATE(PATCH) user with Id: " + userId);
};
