const express = require("express");
const router = express.Router();
const akoOFWDeleteDeviceTokenController = require("../controllers/akoOFWDeleteDeviceToken.controller");

router.delete("/", akoOFWDeleteDeviceTokenController.deleteDeviceTokenByEmail);

module.exports = router;
