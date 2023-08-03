var data = {
  successMessage: null,
  errorMessage: null,
};

exports.game_view = (req, res) => {
  res.render("game", data);
};
