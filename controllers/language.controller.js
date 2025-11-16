import models from "../models/index.js";

const { Language } = models;

export const createLanguage = async (req, res) => {
    try {
        const { name, languageCode } = req.body;

        if (!name || !languageCode) {
            return res.status(400).json({
                error: "name et languageCode sont requis"
            });
        }

        const exists = await Language.findOne({ where: { languageCode } });
        if (exists) {
            return res.status(409).json({
                error: "Un language avec ce code existe déjà"
            });
        }

        const newLanguage = await Language.create({
            name,
            languageCode,
            userId: req.user?.id
        });

        return res.status(201).json(newLanguage);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getAllLanguages = async (req, res) => {
    try {
        const languages = await Language.findAll({
            order: [["id", "DESC"]]
        });

        return res.json(languages);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const getLanguageById = async (req, res) => {
    try {
        const { id } = req.params;

        const language = await Language.findByPk(id);

        if (!language) {
            return res.status(404).json({ error: "Language non trouvé" });
        }

        return res.json(language);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const updateLanguage = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, languageCode } = req.body;

        const language = await Language.findByPk(id);
        if (!language) {
            return res.status(404).json({ error: "Language non trouvé" });
        }

        if (languageCode && languageCode !== language.languageCode) {
            const exists = await Language.findOne({ where: { languageCode } });
            if (exists) {
                return res.status(409).json({
                    error: "Un autre language utilise déjà ce code"
                });
            }
        }

        await language.update({ name, languageCode });

        return res.json(language);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


export const deleteLanguage = async (req, res) => {
    try {
        const { id } = req.params;

        const language = await Language.findByPk(id);
        if (!language) {
            return res.status(404).json({ error: "Language non trouvé" });
        }

        await language.destroy();

        return res.json({ message: "Language supprimé avec succès" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
