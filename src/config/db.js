require("dotenv").config(); // make sure this is called early in your app

const mysql = require("mysql2/promise");

let connection;

const getDb = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT, // <-- include this line for non-default port
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log("✅ Connected to MySQL");
  }
  return connection;
};

module.exports = getDb;
