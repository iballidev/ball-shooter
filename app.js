const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");


dotenv.config();

const dbConnection = require("./config/db.connection");


/**Body parser */
const bodyParser = require("body-parser");
//To use body-parser
//"true" allows you to parse extended body with rich data in it. We put this bodyparser to false
//to support simple body for url-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
//The body-parser code below applies json as a method without argument
//This will extract json data and makes it easily readable
app.use(bodyParser.json());



/**DB Connection */
dbConnection();


/**Routes */
const authRoutes = require("./routes/auth.routes");
const userAccountRoutes = require("./routes/user-account.routes");


app.use("/auth", authRoutes.routes);
app.use("/user-account", userAccountRoutes.routes);

module.exports = app;