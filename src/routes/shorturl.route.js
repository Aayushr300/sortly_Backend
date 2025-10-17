const express = require("express");
const router = express.Router();
const { nanoid } = require("nanoid");
const shortUrlSchema = require("../models/shorturl.model");
const { createShortUrl } = require("../controllers/shorturl.controlers");
const { verifyToken } = require("../middleware/auth");
router.post("/", verifyToken, createShortUrl);

module.exports = router;
