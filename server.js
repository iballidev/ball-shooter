const app = require("./app");
const port = null || process.env.PORT;
const http = require("http");
const winston = require("winston");


// app.listen(port, () => {
//   console.log(`listening to port ${port}`);
// });

const server = http.createServer(app);
server.listen(port, () => {
  winston.info("App is listening on url http://localhost:" + port)
  console.log("App is listening on url http://localhost:" + port);
});
