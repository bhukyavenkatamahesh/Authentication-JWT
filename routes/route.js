const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Get Request Page");
});

router.post("/", (req, res) => {
  res.send("Post Request Page");
});

module.exports = router;
