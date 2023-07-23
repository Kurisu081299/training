const express = require('express');
const router = express.Router();
const akoOFWSakloloController = require('../controllers/akoOFWSaklolo.controller');

// Routes
router.post("/", akoOFWSakloloController.createSaklolo);
router.get("/messages", akoOFWSakloloController.getSakloloByEmailAddress)

module.exports = router;
