// services/policy.service.js
const getDb = require("../config/db");

exports.getStaticPage = async (pageKey) => {
  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT title, content FROM static_pages WHERE page_key = ?",
    [pageKey]
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};
