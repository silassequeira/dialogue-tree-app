const Node = require('./models/nodeSchema');

// Get all nodes
exports.getAllNodes = async (req, res) => {
    try {
        const nodes = await Node.find();
        res.json(nodes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new node
exports.createNode = async (req, res) => {
    const node = new Node(req.body);

    try {
        const newNode = await node.save();
        res.status(201).json(newNode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a node
exports.updateNode = async (req, res) => {
    try {
        const updatedNode = await Node.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedNode) {
            return res.status(404).json({ message: 'Node not found' });
        }

        res.json(updatedNode);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a node
exports.deleteNode = async (req, res) => {
    try {
        const node = await Node.findOneAndDelete({ id: Number(req.params.id) });

        if (!node) {
            return res.status(404).json({ message: 'Node not found' });
        }

        res.json({ message: 'Node deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};