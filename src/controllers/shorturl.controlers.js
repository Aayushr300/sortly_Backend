const express = require("express");
const urlSchema = require("../models/shorturl.model");
const {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} = require("../services/short.service");
const axios = require("axios");
const { getShortUrl } = require("../dao/shortUrl");
const useragent = require("useragent");

exports.createShortUrl = async (req, res, next) => {
  const { url, customAlias } = req.body;
  const userId = req.user?.id || null;

  if (!url) return res.status(400).json({ message: "URL is required" });

  try {
    let shortUrl;

    if (customAlias) {
      shortUrl = await createShortUrlWithUser(url, customAlias, userId);
    } else {
      shortUrl = await createShortUrlWithUser(url, null, userId);
    }

    const fullShortUrl = process.env.APP_URL + "/" + shortUrl;
    return res.json({ shortUrl: fullShortUrl }); // ✅ FIXED!
  } catch (err) {
    next(err);
  }
};

exports.redirectFromShortUrl = async (req, res) => {
  const shortId = req.params.id;

  // Get user-agent
  const userAgentString = req.get("user-agent");
  const agent = useragent.parse(userAgentString);

  // Get IP
  let ip = req.headers["x-forwarded-for"] || req.ip;
  if (ip.startsWith("::ffff:")) {
    ip = ip.substr(7);
  }

  // Get country from IP
  const country = await getCountryFromIP(ip);

  // Get referrer
  const referrer = req.get("referer") || "Direct";

  // Get Google Ads ID if available
  const gclid = req.query.gclid || null;
  const fbclid = req.query.fbclid || null; // Facebook click ID if you want that too

  // Categorize referrer
  let referrerCategory = "Direct"; // Default
  if (referrer.includes("whatsapp")) {
    referrerCategory = "WhatsApp";
  } else if (referrer.includes("facebook")) {
    referrerCategory = "Social Media";
  } else if (referrer.includes("twitter")) {
    referrerCategory = "Social Media";
  } else if (referrer.includes("mail")) {
    referrerCategory = "Email";
  }

  const trim = (str, max) => (str ? str.substring(0, max) : null);

  const clickData = {
    linkId: shortId,
    userId: req.user?.id || null,
    ip: trim(ip, 45),
    country: trim(country, 50),
    gclid: trim(gclid, 50),
    browser: trim(agent.toAgent(), 255),
    os: trim(agent.os.toString(), 255),
    device: trim(agent.device.toString(), 255),
    clickedAt: new Date(),
    referrer: trim(referrer, 255),
    referrerCategory: trim(referrerCategory, 100),
  };

  if (!shortId) {
    return res.status(400).send("Missing short URL ID.");
  }

  try {
    const url = await getShortUrl(shortId, clickData);
    if (!url) {
      return res.status(404).send("Short URL not found.");
    }

    res.redirect(url.full_url);
  } catch (error) {
    console.error("Redirect Error:", error);
    res.status(500).send("Internal Server Error.");
  }
};

async function getCountryFromIP(ip) {
  try {
    // For localhost/testing
    if (ip === "127.0.0.1" || ip === "::1") return "Localhost";

    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=country`
    );
    return response.data.country || "Unknown";
  } catch (error) {
    console.error("Error getting country from IP:", error);
    return "Unknown";
  }
}
