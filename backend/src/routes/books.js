const express = require("express")
const router = express.Router()
const books = require("../controllers/books.controller")

router.post("/", books.createBook)
router.get("/:isbn", books.readBook)
router.get("/recommended/rating", books.readRecommendedBooksByRatings)
router.get("/recommended/preferences", books.readRecommendedBooksByPreferences)

module.exports = router
