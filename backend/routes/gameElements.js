const express = require('express');
const router = express.Router();
const gameElementController = require('../gameElementController.js');

router.get('/', gameElementController.getAllGameElements);
router.post('/', gameElementController.createGameElement);
router.put('/:id', gameElementController.updateGameElement);
router.delete('/:id', gameElementController.deleteGameElement);

module.exports = router;