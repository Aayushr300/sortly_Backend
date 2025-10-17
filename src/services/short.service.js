const { generateNanoId } = require("../utils/helper");
const { nanoid } = require("nanoid");
const shortUrlSchema = require("../models/shorturl.model");
const {
  saveShortUrlWithUserDB,
  saveShortUrlWithOutUserDB,
} = require("../dao/shortUrl");

exports.createShortUrlWithoutUser = async (url) => {
  const shortUrl = generateNanoId(7);
  await saveShortUrlWithOutUserDB(shortUrl, url);
  return shortUrl;
};

exports.createShortUrlWithUser = async (url, alias = null, user_id) => {
  const shortCode = alias || generateNanoId(7);
  await saveShortUrlWithUserDB(shortCode, url, user_id);
  return shortCode;
};
