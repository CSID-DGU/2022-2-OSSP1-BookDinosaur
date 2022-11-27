const express = require("express");
const router = express.Router();
const controller = require("./recommended-books.controller");

router.get("/api/recommend/svd", controller.getRecommendedBooksByRatings);
router.get("/api/recommend/cos", controller.getRecommendedBooksByPreferences);

module.exports = router;
