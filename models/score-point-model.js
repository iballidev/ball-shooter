const mongoose = require("mongoose");

const UserAccountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  scorePoint: {type: Number, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: "UserAccount", required: true },
});

module.exports = mongoose.model("ScorePoint", UserAccountSchema);
