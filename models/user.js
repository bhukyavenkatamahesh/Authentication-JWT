const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
  },
  { timeStamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
