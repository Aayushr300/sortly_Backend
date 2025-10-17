const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");

const { cookieOptions } = require("../config/config");
exports.generateNanoId = (length) => {
  return nanoid(length);
};

exports.signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_TOKENs);
};
