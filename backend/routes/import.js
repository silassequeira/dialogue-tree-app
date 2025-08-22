const express = require('express');
const router = express.Router();
const importController = require('../importController');

router.post('/', importController.importData);

module.exports = router;