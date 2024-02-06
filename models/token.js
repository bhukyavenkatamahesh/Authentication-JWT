const mongoose = require("mongoose");
const activeTokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  expiresAt: Date,
});

const ActiveToken = mongoose.model("ActiveToken", activeTokenSchema);

module.exports = ActiveToken;
