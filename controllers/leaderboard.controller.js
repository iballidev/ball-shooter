const UserAccount = require("../models/user-account.model");

var data = {
  successMessage: null,
  errorMessage: null,
};

exports.leaderboard_view = (req, res) => {
  res.render("leaderboard", data);
};

exports.leaderboard = async (req, res) => {
  let pageNumber = parseInt(req.query.pageNumber) - 1 || 0;
  let pageSize = parseInt(req.query.pageSize) || 10;
  try {
    let count = await UserAccount.count();
    let userAccountList = await UserAccount.find()
      .select("name isOnline scorePoint")
      .skip(pageNumber * pageSize)
      .limit(pageSize);

    // if (!userAccountList.length) {
    //   res.status(200).json({
    //     message: "User account list",
    //     userAccounts: userAccountList,
    //   });
    // }



    res.status(200).json({
      message: "Leaderboard",
      count: count,
      pageNumber: pageNumber + 1,
      pageSize: pageSize,
      userAccounts: userAccountList.sort((a, b) =>
      a['scorePoint'] > b['scorePoint'] ? -1 : 1
    )
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
