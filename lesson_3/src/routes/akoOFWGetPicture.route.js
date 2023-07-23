const express = require("express");
const router = express.Router();
const akoOFWGetPictureController = require("../controllers/akoOFWGetPicture.controller");

router.post("/profile", akoOFWGetPictureController.getPicture);
router.post("/signature", akoOFWGetPictureController.getSignature)

module.exports = router;
