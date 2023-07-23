const express = require('express');
const router = express.Router();
const akoOFWHindiMabutiController = require('../controllers/akoOFWHindiMabuti.controller');

// Routes
router.post("/", akoOFWHindiMabutiController.createSaklolo);

module.exports = router;
