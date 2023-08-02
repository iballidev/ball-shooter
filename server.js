const app = require("./app");
const port = null || process.env.PORT;
const http = require("http");


// app.listen(port, () => {
//   console.log(`listening to port ${port}`);
// });

const server = http.createServer(app);
server.listen(port, () => {
  console.log("App is listening on url http://localhost:" + port);
});
