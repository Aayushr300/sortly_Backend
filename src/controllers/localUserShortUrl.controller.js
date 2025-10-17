const express = require("express");

const {
  createLocalShortUrlWithUser,
} = require("../services/localShortUrl.services");
const { getShortUrl } = require("../dao/shortUrl");

exports.createLocalShortUrl = async (req, res, next) => {
  const { url, customAlias } = req.body;

  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    let shortUrl;

    if (customAlias) {
      shortUrl = await createLocalShortUrlWithUser(url, customAlias);
    } else {
      shortUrl = await createLocalShortUrlWithUser(url, null);
    }

    const fullShortUrl = process.env.APP_URL + "/" + shortUrl;
    return res.json({ shortUrl: fullShortUrl }); // ✅ FIXED!
  } catch (err) {
    next(err);
  }
};

exports.redirectFromShortUrl = async (req, res) => {
  const shortId = req.params.id;

  if (!shortId) {
    return res.status(400).send("Missing short URL ID.");
  }

  try {
    const url = await getShortUrl(shortId);

    if (!url) {
      return res.status(404).send("Short URL not found.");
    }

    res.redirect(url.full_url); // use correct field name (check DB: full_url not fullUrl)
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).send("Internal Server Error.");
  }
};
