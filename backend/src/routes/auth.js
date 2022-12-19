const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/", auth.createSession);
router.get("/logout", auth.deleteSession);
router.get("/", auth.readSession);

module.exports = router;
