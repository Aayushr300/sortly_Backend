const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findUserByEmail, createUser } = require("../dao/user.dao");

exports.registerUser = async (name, email, password) => {
  const user = await findUserByEmail(email);
  if (user) throw new Error("User already exists!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUserId = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Use `id` instead of MongoDB's `_id`
  const token = jwt.sign({ id: createdUserId }, process.env.JWT_TOKEN, {
    expiresIn: "1d",
  });

  return token;
};
