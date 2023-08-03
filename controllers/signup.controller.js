// const { User } = require("../models/signup.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserAccount = require("../models/user-account.model");

var data = {
  successMessage: null,
  errorMessage: null,
};

exports.signup_user_view = (req, res, next) => {
  res.render("signup-user", data);
};

exports.signup_user = (req, res, next) => {
  console.log("req.body: ", req.body);
  const plaintextPassword = req.body.password;
  const saltRoud = 10;

  /* Confirm if email address exist in the database */
  UserAccount.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        // return res.status(409).json({
        //   message: "email/username already exist!",
        // });
        return res.render("signup-user", {
          ...data,
          errorMessage: "email/username already exist!",
        });
      } else {
        bcrypt.hash(plaintextPassword, saltRoud, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new UserAccount({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                // res.status(201).json({
                //   message: "user registered",
                // });
                res.redirect("/auth");
                // res.render("login-user", {
                //   ...data,
                //   successMessage: "user registered",
                // });
              })
              .catch((err) => {
                console.log("Error: ", err);
                // res.status(500).json({
                //   message: "Something went wrong!",
                // });
                return res.render("signup-user", {
                  ...data,
                  errorMessage: "Something went wrong!",
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log("Error: ", err);
      // res.status(500).json({
      //   message: "Something went wrong!",
      // });
      return res.render("signup-user", {
        ...data,
        errorMessage: "Something went wrong!",
      });
    });
};

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409); //Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create and store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
