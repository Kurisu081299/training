const express = require("express");
const router = express.Router();
const akoOFWResetPassController = require("../controllers/akoOFWResetPass.controller");

router.post("/", akoOFWResetPassController.updatePass);

module.exports = router;
