const express = require("express");
const { submit_score_point } = require("../controllers/score-point.controller");
const router = express.Router();

router.post("/", submit_score_point);

module.exports = {
  routes: router,
};
