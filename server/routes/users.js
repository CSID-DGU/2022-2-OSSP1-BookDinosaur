const express = require("express");
const router = express.Router();
const users = require("./users.controller");

router.post("/", users.createUser);

module.exports = router;
