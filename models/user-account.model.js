const mongoose = require("mongoose");
const USER_ROLES = require("../config/user-roles");

const UserAccountSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  roles: {
    User: { type: Number, required: true, default: USER_ROLES.User },
    Admin: Number,
    Editor: Number,
  },
  refreshToken: { type: String, default: "" },
  scorePoint: { type: Number, required: true, default: 0 },
  isOnline: { type: Boolean, default: false },
});

module.exports = mongoose.model("UserAccount", UserAccountSchema);
