const express = require("express");
const router = express.Router();
const akoofwPasswordController = require("../controllers/akoOFWPassword.controller");

router.get("/resetpassword/:token", akoofwPasswordController.verifyJWT);
router.post("/resetpassword/:token", akoofwPasswordController.resetPassword);
router.put("/forgotpassword", akoofwPasswordController.forgotPassword);

module.exports = router;
