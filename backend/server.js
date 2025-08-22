const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (if using MongoDB)
mongoose.connect('mongodb://localhost:27017/dialogue-tree')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/nodes', require('./routes/nodes'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/gameElements', require('./routes/gameElements'));
app.use('/api/export', require('./routes/export'));
app.use('/api/import', require('./routes/import'));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});