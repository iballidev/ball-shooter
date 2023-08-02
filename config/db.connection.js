const mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost/shooting-game", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: true,
      // useCreateIndex: true,
    })
    .then(() => {
      console.log("connecting...");
      console.log("MongoDb connected successfully!");
    });
};
