const UserAccount = require("../models/user-account.model");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

exports.get_all_user_accounts = async (req, res) => {
  let pageNumber = parseInt(req.query.pageNumber) - 1 || 0;
  let pageSize = parseInt(req.query.pageSize) || 10;
  try {
    let count = await UserAccount.count();
    let userAccountList = await UserAccount.find()
      .select("email")
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

exports.update_patch_user_score_point = async (req, res) => {
  const scorePoint = req.body.scorePoint;
  const authHeader = req.session.accessToken; //Bearer token

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err || !decoded) return res.sendStatus(403);

      userId = decoded.userInfo.userId;

      user = await UserAccount.findById({ _id: userId });

      if (user) {
        /** Store(save) new score point inside the session */
        req.session.scorePoint = scorePoint;
        user.scorePoint = scorePoint;

        console.log("req.session: ", req.session);

        let _user = await user.save();

        if (_user) {
          res.status(200).json({
            message: "Score saved!",
          });
        }
      } else {
        return res.status(500).json({
          message: "something went wrong!",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
    });
  }
};

exports.update_patch_user_isOnline = async (req, res) => {
  const isOnline = req.body.isOnline;
  const authHeader = req.session.accessToken; //Bearer token

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err || !decoded) return res.sendStatus(403);

      userId = decoded.userInfo.userId;

      user = await UserAccount.findById({ _id: userId });

      if (user) {
        /** Store(save) new score point inside the session */
        req.session.isOnline = isOnline;
        user.isOnline = isOnline;

        console.log("req.session: ", req.session);

        let _user = await user.save();

        if (_user) {
          res.status(200).json({
            message: "Score saved!",
          });
        }
      } else {
        return res.status(500).json({
          message: "something went wrong!",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
    });
  }
};
