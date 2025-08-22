const express = require('express');
const router = express.Router();
const exportController = require('../exportController');

router.get('/', exportController.exportData);

module.exports = router;