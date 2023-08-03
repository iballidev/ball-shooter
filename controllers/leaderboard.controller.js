var data = {
  successMessage: null,
  errorMessage: null,
};

exports.leaderboard_view = (req, res) => {
  res.render("leaderboard", data);
};
