const express = require("express");
const router = express.Router();
const {
  createLocalShortUrl,
} = require("../controllers/localUserShortUrl.controller");

router.post("/create", createLocalShortUrl);

module.exports = router;
