const express = require("express");
const router = express.Router();
const akoOFWPushNotificationController = require("../controllers/akoOFWPushNotification.controller");

router.post("/", akoOFWPushNotificationController.sendNotification);
router.post("/specific", akoOFWPushNotificationController.sendSpecificNotification);

module.exports = router;
