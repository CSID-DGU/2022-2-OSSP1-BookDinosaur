const express = require("express");
const router = express.Router();
const controller = require("../controllers/book-reports.controller");

router.post("/", controller.createBookReport);
router.get("/", controller.getBookReports);
router.get("/:isbn/:userid", controller.getBookReport); // TODO;

module.exports = router;
