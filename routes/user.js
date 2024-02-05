const express = require("express");
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("Signup");
});

router.post("/signin", (req, res) => {
  res.send("SignIn");
});

module.exports = router;
