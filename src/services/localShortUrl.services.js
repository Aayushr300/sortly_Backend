const { generateNanoId } = require("../utils/helper");
const { nanoid } = require("nanoid");
const shortUrlSchema = require("../models/shorturl.model");
const { saveLocalShortUrlDB } = require("../dao/localShortUrl");

exports.createLocalShortUrlWithUser = async (url, alias = null) => {
  const shortCode = alias || generateNanoId(7);
  await saveLocalShortUrlDB(url, shortCode);
  return shortCode;
};
