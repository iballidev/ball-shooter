const UserAccount = require("../models/user-account.model");

const handleLogout = async (req, res, next) => {
  // On the client side, also delete the accessToken
  console.log("logout space");
  const cookies = req.cookies;
  console.log("cookies: ", cookies);
  console.log("cookies.jwt: ", cookies.jwt);
  // if (!cookies?.jwt) return res.sendStatus(204); //"successful(204): successful with No content to send back"
  if (!cookies.jwt) return res.redirect("/auth"); //"successful(204): successful with No content to send back"
  console.log("cookies.jwt: ", cookies.jwt);
  const refreshToken = cookies.jwt;

  /**Check data base for user refresh token */
  const foundUser = await UserAccount.findOne({ refreshToken }).exec();
  console.log("foundUser: ", foundUser);
  if (!foundUser) {
    req.session.accessToken = "";
    res.clearCookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.status(204).json({
      message: "Logout successful!!!",
    });
  }
  /** */

  // Delete refreshToken in db
  foundUser.refreshToken = "";
  req.session.accessToken = "";
  req.session.user = null;
  res.locals.isAuthenticated = null;
  const result = await foundUser.save();
  console.log("result: ", result);
  res.clearCookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  // res.status(204).json({
  //   message: "Logout successful!!!",
  // });
  res.redirect("/auth");
  // ...
};

module.exports = { handleLogout };
