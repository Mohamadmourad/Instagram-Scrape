const express = require('express');
const { getUserData } = require('../controllers/scrapingController');

const router = express.Router();
router.get('/:username', getUserData);

module.exports = router;