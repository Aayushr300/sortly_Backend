const express = require("express");
const router = express.Router();
const { getPolicyPage } = require("../controllers/policy.controller");

router.get("/:pageKey", getPolicyPage);

module.exports = router;
