const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const expressLayoutes = require("express-ejs-layouts");
const verifyJWT = require("./middlewares/veryfyJWT");
const err = require("./middlewares/errors");
const jwt = require("jsonwebtoken");

const UserAccount = require("./models/user-account.model");

const credentials = require("./middlewares/credentials");
const corsOptions = require("./config/cors-options");

const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");

var session = require("express-session");

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

/**cookieParser */
app.use(cookieParser());

/**cookieSession */
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

/**express-session */
// app.set("trust proxy", 1); // trust first proxy
// app.use(
//   session({
//     secret: "keyboard cat",
//     resave: false,
//     saveUninitialized: true,
//     // genid: function (req) {
//     //   return genuuid(); // use UUIDs for session IDs
//     // },
//     cookie: { secure: "auto" },
//   })
// );

app.use(async (req, res, next) => {
  res.locals.user = req.session.user?.userInfo;
  res.locals.isLoggedIn = true;

  let token = req.session.accessToken;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded) return (res.locals.isLoggedIn = true);

    req.user = decoded.userInfo.email;
    req.userId = decoded.userInfo._id;
    req.roles = decoded.userInfo.roles;
    req.session.user = decoded;
    res.locals.user = req.session.user?.userInfo;

    if (decoded.exp * 1000 < new Date().getTime()) {
      res.locals.isLoggedIn = false;
    }
    res.locals.isLoggedIn = true;
  });

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

app.use("/signup", signupRoutes.routes);
app.use("/auth", authRoutes.routes);
app.use("/logout", logoutRoutes.routes);
app.use(verifyJWT);
app.use("/user-account", userAccountRoutes.routes);
app.use("/game", gameRoutes.routes);
app.use("/leaderboard", leaderBoardRoutes.routes);

app.use(err);

module.exports = app;
