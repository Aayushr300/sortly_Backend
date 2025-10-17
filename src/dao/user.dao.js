const User = require("../models/user.model");
const getDb = require("../config/db");

exports.findUserByEmail = async (email) => {
  const db = await getDb();
  const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

exports.findUserById = async (id) => {
  return await User.findById(id);
};

exports.createUser = async ({ name, email, password }) => {
  const db = await getDb();
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password]
  );
  return result.insertId; // MySQL auto-increment ID
};
