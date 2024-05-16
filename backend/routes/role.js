const express = require("express");

const { findAllRoles } = require("../controllers/role");

const router = express.Router();

router.get("/", findAllRoles);

module.exports = router;
