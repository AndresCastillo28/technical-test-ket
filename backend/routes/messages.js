const express = require("express");

const { findAll } = require("../controllers/messages");
const { validateJWT } = require("../middlewares/validateJWT");

const router = express.Router();

router.get("/", validateJWT ,findAll);

module.exports = router;