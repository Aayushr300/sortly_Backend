const getDb = require("../config/db");

exports.saveLocalShortUrlDB = async (longUrl, shortUrl) => {
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO short_urls (full_url, short_url) VALUES (?, ?)`,
      [longUrl, shortUrl]
    );
  } catch (error) {
    console.error("Error saving short URL:", error);
    throw error;
  }
};
