const Connection = require('./models/connectionSchema');

exports.getAllConnections = async (req, res) => {
    try {
        const connections = await Connection.find();
        res.json(connections);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createConnection = async (req, res) => {
    const connection = new Connection(req.body);

    try {
        const newConnection = await connection.save();
        res.status(201).json(newConnection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateConnection = async (req, res) => {
    try {
        const updatedConnection = await Connection.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedConnection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        res.json(updatedConnection);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteConnection = async (req, res) => {
    try {
        const connection = await Connection.findOneAndDelete({ id: Number(req.params.id) });

        if (!connection) {
            return res.status(404).json({ message: 'Connection not found' });
        }

        res.json({ message: 'Connection deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};