const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  category: String,
  comments: String,
  email: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Request", requestSchema);
