const UserAccount = require("../models/user-account.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**SIGNUP */
exports.signup_user = async (req, res) => {
  const plaintextPassword = req.body.password;
  const saltRound = 10;

  /* Confirm if email address exist in the database */
  let user = await UserAccount.find({ email: req.body.email }).select("email"); // select("email") will display only email address of the found user

  if (user.length >= 1) {
    return res.status(409).json({
      message: "UserAccount already exists!!!",
    });
  } else {
    /**Hashing new user password */
    bcrypt.hash(plaintextPassword, saltRound, async (error, hash) => {
      if (error) {
        return res.status(500).json({
          error: error,
        });
      } else {
        /**Save new user */
        const newUserAccount = await new UserAccount({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash,
        });

        // let _user = await newUserAccount.save();
        await newUserAccount.save();
        res.status(201).json({
          message: "user created!",
          // user: _user,
        });
      }
    });
  }
};

/**LOGIN */
exports.login_user = async (req, res) => {
  const IsKeepLoggedIn = req.body.IsKeepLoggedIn;
  const account = {
    email: req.body.email,
    password: req.body.password,
  };

  /* Confirm if email address exist in the database */
  let user = await UserAccount.find({ email: account.email });
  if (user.length < 1) {
    return res.status(409).json({
      message: "Auth failed!!!",
    });
  }
  bcrypt
    .compare(account.password, user[0].password)
    .then(async (result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }

      let accessToken, refreshToken;
      if (IsKeepLoggedIn) {
        /**Assign Refresh token */
        accessToken = assignJwt(user, "5hr", process.env.ACCESS_TOKEN_SECRET);
        /**Assign Access token */
        refreshToken = assignJwt(user, "8d", process.env.REFRESH_TOKEN_SECRET);
      } else {
        accessToken = assignJwt(user, "1hr", process.env.ACCESS_TOKEN_SECRET);
        refreshToken = assignJwt(user, "4d", process.env.REFRESH_TOKEN_SECRET);
      }

      // // Save refreshToken in db
      user[0].refreshToken = await refreshToken;
      user[0]
        .save()
        .then((result) => {
          // console.log("result: ", result);
          res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            // secure: false,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.status(200).json({
            message: "Auth successful!!!",
            token: accessToken,
          });
        })
        .catch((err) => {
          console.log("err: ", err);
          res.status(500).json({
            message: "Something went wrong!",
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong!",
      });
    });
};

/**Assign token */
function assignJwt(user, tokenExp, token_secret) {
  let token = jwt.sign(
    {
      userInfo: {
        email: user[0]?.email,
        userId: user[0]?._id,
        roles: user[0]?.roles,
      },
    },
    token_secret,
    { expiresIn: `${tokenExp}` }
  );
  return token;
}
