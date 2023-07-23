const express = require('express');
const router = express.Router();
const akoOFWSignController = require('../controllers/akoOFWSign.controller');

// Routes
router.post("/userdetails", akoOFWSignController.updateUserDetails);
router.post("/emailpass", akoOFWSignController.createEmailPass)
router.post("/admin", akoOFWSignController.createAdminOne)
router.delete("/user", akoOFWSignController.deleteUserByEmail);

module.exports = router;
