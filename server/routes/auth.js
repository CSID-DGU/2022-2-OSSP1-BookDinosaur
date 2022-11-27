const express = require("express");
const router = express.Router();
const auth = require("./auth.controller");

router.post("/", auth.createSession);
router.delete("/", auth.deleteSession);
router.get("/", auth.readSession);

module.exports = router;
