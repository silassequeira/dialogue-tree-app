const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
    id: Number,
    type: String,
    x: Number,
    y: Number,
    text: String,
    choices: [String],
    associatedNpc: String,
    conditions: {
        requiredItems: [String],
        requiredLocation: String,
        custom: String
    },
    consequences: {
        giveItems: [String],
        removeItems: [String],
        changeLocation: String,
        custom: String
    }
});

module.exports = mongoose.model('Node', nodeSchema);