const express = require("express");
const router = express.Router();
const akoOFWUploadController = require("../controllers/akoOFWUpload.controller");

router.post("/", akoOFWUploadController.uploadPicture);
router.post("/attachments", akoOFWUploadController.uploadAttachments)

module.exports = router;
