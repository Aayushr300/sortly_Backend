const getDb = require("../config/db");

exports.saveShortUrlWithUserDB = async (shortUrl, longUrl, userId) => {
  try {
    const db = await getDb();
    const now = new Date();
    await db.execute(
      `INSERT INTO short_urls (full_url, short_url, user_id,created_at) VALUES (?, ?, ?, ?)`,
      [longUrl, shortUrl, userId, now]
    );
  } catch (error) {
    console.error("Error saving short URL with user:", error);
  }
};

exports.saveShortUrlWithOutUserDB = async (shortUrl, longUrl) => {
  try {
    const db = await getDb();
    await db.execute(
      `INSERT INTO short_urls (full_url, short_url) VALUES (?, ?)`,
      [longUrl, shortUrl]
    );
  } catch (error) {
    console.error("Error saving short URL without user:", error);
  }
};

// exports.getShortUrl = async (id, clickData) => {
//   try {
//     const db = await getDb();

//     await db.execute(
//       "UPDATE short_urls SET click = click + 1 WHERE short_url = ?",
//       [id]
//     );

//     const [rows] = await db.execute(
//       "SELECT * FROM short_urls WHERE short_url = ?",
//       [id]
//     );

//     if (!rows.length) return null;

//     const shortUrlData = rows[0];
//     const userId = shortUrlData.user_id;
//     const linkId = shortUrlData.id;

//     // 1. Update total click count
//     await db.execute("UPDATE short_urls SET click = click + 1 WHERE id = ?", [
//       linkId,
//     ]);

//     await db.execute(
//       "INSERT INTO clicks (link_id, user_id, ip, browser, os, device, referrer, referrer_category , country, gclid) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)",
//       [
//         linkId,
//         userId,
//         clickData.ip,
//         clickData.browser,
//         clickData.os,
//         clickData.device,
//         clickData.referrer, // pass referrer
//         clickData.referrerCategory,
//         clickData.country,
//         clickData.gclid,
//       ]
//     );

//     return rows[0] || null;
//   } catch (error) {
//     console.error("Error in getShortUrl:", error);
//     throw error;
//   }
// };

exports.getShortUrl = async (id, clickData) => {
  try {
    const db = await getDb();

    const [rows] = await db.execute(
      "SELECT * FROM short_urls WHERE short_url = ?",
      [id]
    );

    if (!rows.length) return null;

    const shortUrlData = rows[0];
    const userId = shortUrlData.user_id;
    const linkId = shortUrlData.id;

    // ✅ Only one update to increment clicks
    await db.execute("UPDATE short_urls SET click = click + 1 WHERE id = ?", [
      linkId,
    ]);

    // ✅ Insert click tracking data
    await db.execute(
      "INSERT INTO clicks (link_id, user_id, ip, browser, os, device, referrer, referrer_category , country, gclid) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?)",
      [
        linkId,
        userId,
        clickData.ip,
        clickData.browser,
        clickData.os,
        clickData.device,
        clickData.referrer,
        clickData.referrerCategory,
        clickData.country,
        clickData.gclid,
      ]
    );

    return shortUrlData;
  } catch (error) {
    console.error("Error in getShortUrl:", error);
    throw error;
  }
};
