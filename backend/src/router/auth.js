const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");

router.post("/api/db/users/login", controller.login);
router.get("/api/db/users/logout", controller.logout);
router.post("/api/db/users", controller.signup);
router.get("/api/session", controller.getSession);

module.exports = router;
