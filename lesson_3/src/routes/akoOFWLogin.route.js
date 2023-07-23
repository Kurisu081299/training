const express = require('express');
const router = express.Router();
const akoOFWLoginController = require('../controllers/akoOFWLogin.controller');

// Routes
router.post("/", akoOFWLoginController.login);
router.post("/admin", akoOFWLoginController.loginAdmin);
router.get("/emails", akoOFWLoginController.getAllEmails);

module.exports = router;
