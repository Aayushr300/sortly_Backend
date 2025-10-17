const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  fullUrl: {
    type: String,
    require: true,
  },
  short_url: {
    type: String,
    require: true,
    index: true,
    unique: true,
  },
  click: {
    type: Number,
    require: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const shortUrl = mongoose.model("shortUrl", shortUrlSchema);
module.exports = shortUrl;
