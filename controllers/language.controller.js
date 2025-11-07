import models from "../models/index.js";
const { Language, Contact } = models;

export const createLanguage = async (req, res) => {
    try {
        const lang = await Language.create(req.body);
        res.status(201).json(lang);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getLanguages = async (req, res) => {
    try {
        const langs = await Language.findAll({
            include: [{ model: Contact, as: "contacts" }],
        });
        res.json(langs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getLanguageById = async (req, res) => {
    try {
        const lang = await Language.findByPk(req.params.id, {
            include: [{ model: Contact, as: "contacts" }],
        });
        if (!lang) return res.status(404).json({ message: "Language not found" });
        res.json(lang);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateLanguage = async (req, res) => {
    try {
        const lang = await Language.findByPk(req.params.id);
        if (!lang) return res.status(404).json({ message: "Language not found" });
        await lang.update(req.body);
        res.json(lang);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteLanguage = async (req, res) => {
    try {
        const lang = await Language.findByPk(req.params.id);
        if (!lang) return res.status(404).json({ message: "Language not found" });
        await lang.destroy();
        res.json({ message: "Language deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
