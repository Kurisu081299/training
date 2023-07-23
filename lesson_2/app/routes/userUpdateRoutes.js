const express = require('express');
const router = express.Router();
const userUpdateController = require('../controllers/userUpdateController');

// Routes
router.put("/", userUpdateController.updateUser);

module.exports = router;