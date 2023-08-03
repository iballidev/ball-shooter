const fs = require("fs");
const path = require("path");
const appendRequestToken = (req, res, next) => {
  console.log("appendRequestToken: ", req.headers);
  fs.readFile(
    path.join(__dirname, "../config", "client-access-token.txt"),
    "utf-8",
    (err, data) => {
      console.log("readFile data: ", data);
      if (err) throw err;
    }
  );
  next();
};

module.exports = appendRequestToken;
