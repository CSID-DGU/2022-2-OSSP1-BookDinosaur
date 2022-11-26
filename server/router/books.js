const express = require("express");
const router = express.Router();
const controller = require("./books.controller");

router.post("/api/db/books", controller.createBook);
router.get("/api/db/books/:isbn", controller.getBook);

module.exports = router;
