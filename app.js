const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const expressLayoutes = require("express-ejs-layouts");
const verifyJWT = require("./middlewares/veryfyJWT");
const err = require("./middlewares/errors");

const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/cors-options");

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


/**Handle options credentials check - before CORS!
 * and fetch cookies credentials requirement
 */ app.use(credentials);

/**Cross Origin Resource Sharing */
app.use(cors(corsOptions));

/**DB Connection */
dbConnection();

/**Cookie */
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: [
      /* secret keys */
      "hello",
    ],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(function (req, res, next) {
    // console.log("req.locals sessions: ", req.session);
    // console.log("req.locals cookie.jwt: ", req.cookies.jwt);
    if (req.session.user) {
      res.locals.isAuthenticated = req.session.user;
    //   console.log("res.locals 1: ", res.locals.isAuthenticated);
    } else {
      res.locals.isAuthenticated = null;
    //   console.log("res.locals 2: ", res.locals.isAuthenticated);
      // res.locals.isAuthenticated = req.isAuthenticated();
    }
    next();
  });
  

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(expressLayoutes);

/**Routes */
const signupRoutes = require("./routes/signup.routes");
const authRoutes = require("./routes/auth.routes");
const leaderBoardRoutes = require("./routes/leaderboard.routes");
const userAccountRoutes = require("./routes/user-account.routes");
const gameRoutes = require("./routes/game.routes");
const logoutRoutes = require("./routes/logout.routes");
const scorePointRoutes = require("./routes/score-point.routes");

app.use("/signup", signupRoutes.routes);
app.use("/auth", authRoutes.routes);
app.use("/leaderboard", leaderBoardRoutes.routes);
app.use("/logout", logoutRoutes.routes);
app.use("/score-point", scorePointRoutes.routes);
app.use(verifyJWT);
app.use("/user-account", userAccountRoutes.routes);
app.use("/game", gameRoutes.routes);

app.use(err);



module.exports = app;
