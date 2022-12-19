const express = require("express")
const router = express.Router()
const controller = require("../controllers/book-reports.controller")

router.post("/api/db/bookreports", controller.createBookReport)
router.get("/api/db/bookreports/new", controller.getBookReportsSortByDate)
router.get("/api/db/bookreports/view", controller.getBookReportsSortByView)
router.get("/api/db/books/bookreports/:isbn", controller.getBookReportsByISBN)
router.get(
    "/api/db/users/bookreports/:userid",
    controller.getBookReportsByUserID
)
router.get("/api/db/bookreports/:isbn/:userid", controller.getBookReport)

module.exports = router
