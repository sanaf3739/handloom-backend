const { Router } = require("express");
const { handleAnalytics } = require("../controllers/dashboard.controller.js");

const router = Router();

router.get("/analytics", handleAnalytics)

module.exports = router;
