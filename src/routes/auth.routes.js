const express = require("express");
const router = express.Router();
const { register, login, rec } = require("../controllers/auth.controller");
const {
  getRecentLinksByUser,
  getUserLinkStats,
  getTopLinks,
  getUserAllLinks,
  getUserSettings,
  changePassword,
  userProfileUpdate,
  getClicksPerDay,
  getClicksDetails,
  getUserTopReferrers,
  getDeleteLinks,
  getSingleLinkStats,
} = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/auth");
const { verify } = require("jsonwebtoken");
router.post("/register", register);
router.post("/login", login);

router.get("/users/recent-links", verifyToken, getRecentLinksByUser);
router.get("/users/user-details", verifyToken, getUserLinkStats);
router.get("/users/user-details/:id", verifyToken, getSingleLinkStats);
router.get("/users/top-links", verifyToken, getTopLinks);
router.get("/users/all-links", verifyToken, getUserAllLinks);

router.get("/users/settings", verifyToken, getUserSettings);
router.put("/users/profile-update", verifyToken, userProfileUpdate);
router.put("/users/change-password", verifyToken, changePassword);
router.get("/users/clicks-per-day", verifyToken, getClicksPerDay);
router.get("/users/click-details", verifyToken, getClicksDetails);
router.get("/users/top-referrers", verifyToken, getUserTopReferrers);
router.delete("/shortlinks/:id", verifyToken, getDeleteLinks);

module.exports = router;
