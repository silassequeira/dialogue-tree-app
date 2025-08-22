const express = require('express');
const router = express.Router();
const connectionController = require('../connectionController.js'); // Placeholder

router.get('/', connectionController.getAllConnections);
router.post('/', connectionController.createConnection);
router.put('/:id', connectionController.updateConnection);
router.delete('/:id', connectionController.deleteConnection);

module.exports = router;