const express = require("express");
const router = express.Router();
const akoOFWReadNotificationController = require("../controllers/akoOFWReadNotification.controller");

router.get("/", akoOFWReadNotificationController.readNotification);
router.put("/", akoOFWReadNotificationController.updateStatus);
router.put("/updatestatus", akoOFWReadNotificationController.updateAllStatus);

module.exports = router;