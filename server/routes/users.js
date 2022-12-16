const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controller");

router.post("/", users.createUser);

module.exports = router;
