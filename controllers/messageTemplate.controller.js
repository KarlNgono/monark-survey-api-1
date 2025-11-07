import models from "../models/index.js";

const {MessageTemplate} = models;
export const createTemplate = async (req, res) => {
    try {
        const {name, subject, content_html, content_text, language_code} = req.body;

        if (!name || !subject || !content_html || !content_text || !language_code) {
            return res.status(400).json({message: "Tous les champs sont obligatoires."});
        }

        const template = await MessageTemplate.create({
            name,
            subject,
            content_html,
            content_text,
            language_code
        });

        return res.status(201).json({
            message: "Template créé avec succès",
            template
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};

export const getAllTemplates = async (req, res) => {
    try {
        const templates = await MessageTemplate.findAll();
        return res.status(200).json(templates);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};

export const getTemplateById = async (req, res) => {
    try {
        const {id} = req.params;
        const template = await MessageTemplate.findByPk(id);

        if (!template) return res.status(404).json({message: "Template non trouvé"});

        return res.status(200).json(template);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, subject, content_html, content_text, language_code} = req.body;

        const template = await MessageTemplate.findByPk(id);
        if (!template) return res.status(404).json({message: "Template non trouvé"});

        await template.update({name, subject, content_html, content_text, language_code});

        return res.status(200).json({
            message: "Template mis à jour avec succès",
            template
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        const {id} = req.params;
        const template = await MessageTemplate.findByPk(id);

        if (!template) return res.status(404).json({message: "Template non trouvé"});

        await template.destroy();

        return res.status(200).json({message: "Template supprimé avec succès"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur", error: error.message});
    }
};
