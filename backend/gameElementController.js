const GameElement = require('./models/gameElementSchema');

exports.getAllGameElements = async (req, res) => {
    try {
        const gameElements = await GameElement.find();
        res.json(gameElements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGameElement = async (req, res) => {
    const gameElement = new GameElement(req.body);

    try {
        const newGameElement = await gameElement.save();
        res.status(201).json(newGameElement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateGameElement = async (req, res) => {
    try {
        const updatedGameElement = await GameElement.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );

        if (!updatedGameElement) {
            return res.status(404).json({ message: 'Game Element not found' });
        }

        res.json(updatedGameElement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGameElement = async (req, res) => {
    try {
        const gameElement = await GameElement.findOneAndDelete({ id: Number(req.params.id) });

        if (!gameElement) {
            return res.status(404).json({ message: 'Game Element not found' });
        }

        res.json({ message: 'Game Element deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};