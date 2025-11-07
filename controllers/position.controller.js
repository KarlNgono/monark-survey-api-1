import models from "../models/index.js";
const { Position, Department, Contact } = models;

export const createPosition = async (req, res) => {
    try {
        const pos = await Position.create(req.body);
        res.status(201).json(pos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPositions = async (req, res) => {
    try {
        const positions = await Position.findAll({
            include: [
                { model: Department, as: "department" },
                { model: Contact, as: "contacts" },
            ],
        });
        res.json(positions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getPositionById = async (req, res) => {
    try {
        const pos = await Position.findByPk(req.params.id, {
            include: [
                { model: Department, as: "department" },
                { model: Contact, as: "contacts" },
            ],
        });
        if (!pos) return res.status(404).json({ message: "Position not found" });
        res.json(pos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updatePosition = async (req, res) => {
    try {
        const pos = await Position.findByPk(req.params.id);
        if (!pos) return res.status(404).json({ message: "Position not found" });
        await pos.update(req.body);
        res.json(pos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deletePosition = async (req, res) => {
    try {
        const pos = await Position.findByPk(req.params.id);
        if (!pos) return res.status(404).json({ message: "Position not found" });
        await pos.destroy();
        res.json({ message: "Position deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
