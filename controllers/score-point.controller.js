const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const UserAccount = require("../models/user-account.model");
const ScorePoint = require("../models/score-point-model");
const mongoose = require("mongoose");

dotenv.config();

exports.submit_score_point = async (req, res) => {
  const scorePoint = req.body.scorePoint;

  console.log("Hello");
  console.log("req.body: ", req.body);
  console.log("scorePoint: ", scorePoint);

  try {
    if (!req.session.accessToken) return res.redirect("/auth");
    const authHeader = req.session.accessToken; //Bearer token

    const token = authHeader.split(" ")[1];

    console.log("token: ", token);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err || !decoded) return res.sendStatus(403);
      // if (err || !decoded) return res.redirect("/auth"); //"forbidden(403): Invalid token, redirect to login"

      console.log("decoded: ", decoded);
      userId = decoded.userInfo.userId;

      console.log("userId: ", userId);

      user = UserAccount.findById({ _id: userId });
      console.log("user: ", user);

      if (user) {
        console.log("user: ", user);

        const scorePoint = new ScorePoint({
          _id: new mongoose.Types.ObjectId(),
          scorePoint: req.body.scorePoint,
          user: userId,
        });

        let _scorePoint = await scorePoint.save();

        if (_scorePoint) {
          res.status(200).json({
            message: "Score saved!",
          });
        }
      } else {
        // if (!req.session.accessToken) return res.redirect("/auth");
        return res.sendStatus(500);
      }
    });
  } catch (err) {
    console.log("Error: ", err);
    res.sendStatus(500);
  }
};
