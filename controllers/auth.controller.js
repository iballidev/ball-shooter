const UserAccount = require("../models/user-account.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

var data = {
  successMessage: null,
  errorMessage: null,
};

/**LOGIN */
exports.login_user_view = (req, res, next) => {
  res.render("login-user", data);
};

exports.login_user = async (req, res) => {
  const IsKeepLoggedIn = req.body.IsKeepLoggedIn;
  const account = {
    email: req.body.email,
    password: req.body.password,
  };

  /* Confirm if email address exist in the database */
  let user = await UserAccount.find({ email: account.email });
  if (user.length < 1) {
    // return res.status(409).json({
    //   message: "Auth failed!!!",
    // });

    console.log("user login: ", user);
    if (user.length < 1) {
      return res.render("login-user", {
        ...data,
        errorMessage: "Login failed!",
      });
    }
  } else {
    bcrypt
      .compare(account.password, user[0].password)
      .then(async (result) => {
        if (!result) {
          return res.render("login-user", {
            ...data,
            errorMessage: "Login failed!",
          });
        }

        let accessToken, refreshToken;
        if (IsKeepLoggedIn) {
          /**Assign Refresh token */
          accessToken = assignJwt(user, "5hr", process.env.ACCESS_TOKEN_SECRET);
          /**Assign Access token */
          refreshToken = assignJwt(
            user,
            "8d",
            process.env.REFRESH_TOKEN_SECRET
          );
        } else {
          accessToken = assignJwt(user, "1hr", process.env.ACCESS_TOKEN_SECRET);
          refreshToken = assignJwt(
            user,
            "4d",
            process.env.REFRESH_TOKEN_SECRET
          );
        }

        /** Write(save) new access token inside the 'client-access-token.txt' file */
        fs.writeFile(
          path.join(__dirname, "../config", "client-access-token.txt"),
          `Bearer ${accessToken}`,
          (err) => {
            if (err) throw err;
          }
        );
        /** Store(save) new access token inside the seesion */
        req.session.accessToken = `Bearer ${accessToken}`;

        // // Save refreshToken in db
        user[0].refreshToken = await refreshToken;
        user[0]
          .save()
          .then((result) => {
            console.log("result: ", result);
            res.cookie("jwt", refreshToken, {
              httpOnly: true,
              sameSite: "None",
              secure: true,
              // secure: false,
              maxAge: 24 * 60 * 60 * 1000,
            });
            // res.status(200).json({
            //   message: "Auth successful!!!",
            //   token: accessToken,
            // });
            res.redirect("/leaderboard");
          })
          .catch((err) => {
            console.log("err: ", err);
            return res.render("login-user", {
              ...data,
              errorMessage: "Something went wrong!",
            });
          });
      })
      .catch((err) => {
        console.log("err: ", err);
        return res.render("login-user", {
          ...data,
          errorMessage: "Something went wrong!",
        });
      });
  }
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
