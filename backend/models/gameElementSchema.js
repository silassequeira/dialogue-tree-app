const mongoose = require('mongoose');

const gameElementSchema = new mongoose.Schema({
    npcs: [String],
    items: [String],
    locations: [String]
});

module.exports = mongoose.model('GameElement', gameElementSchema);