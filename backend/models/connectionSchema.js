const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    from: Number,
    to: Number
});

module.exports = mongoose.model('Connection', connectionSchema);