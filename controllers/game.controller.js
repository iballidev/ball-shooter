const UserAccount = require("../models/user-account.model");

var data = {
  successMessage: null,
  errorMessage: null,
  // userScorePoint: null,
};

exports.game_view = async (req, res) => {
  // const userId = req.session.user.userInfo.userId;
  // console.log("req.session.user: ", req.session.user);
  // console.log("data: ", data);

  // const user = await UserAccount.findById({ _id: userId });
  // if (user) {
  //   console.log("user: ", user);
  //   console.log("user scorePoint: ", user.scorePoint);
  //   data.userScorePoint = user.scorePoint;
  // }
  res.render("game", data);
};
