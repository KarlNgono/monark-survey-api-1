import models from "../models/index.js";
const { EmailTemplate, EmailContent } = models;

export const createEmailTemplate = async (req, res) => {
    try {
        const { name, content_html } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le champ 'name' est requis." });
        }

        if (!content_html) {
            return res.status(400).json({ message: "Le champ 'content_html' est obligatoire." });
        }

        const template = await EmailTemplate.create({
            name,
            content_html
        });

        return res.status(201).json({
            message: "EmailTemplate créé avec succès",
            template
        });

    } catch (err) {
        console.error("createEmailTemplate error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

export const getEmailTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({
            include: [{ model: EmailContent, as: "contents" }]
        });

        return res.json(templates);

    } catch (err) {
        console.error("getEmailTemplates error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

export const getEmailTemplateById = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await EmailTemplate.findByPk(id, {
            include: [{ model: EmailContent, as: "contents" }]
        });

        if (!template) {
            return res.status(404).json({ message: "Template non trouvé" });
        }

        return res.json(template);

    } catch (err) {
        console.error("getEmailTemplateById error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

export const updateEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template non trouvé" });
        }

        const { name, content_html } = req.body;

        if (!content_html) {
            return res.status(400).json({ message: "content_html est obligatoire." });
        }

        await template.update({
            name: name || template.name,
            content_html: content_html
        });

        return res.json({
            message: "Template mis à jour avec succès",
            template
        });

    } catch (err) {
        console.error("updateEmailTemplate error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

export const deleteEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template non trouvé" });
        }

        await template.destroy();

        return res.json({ message: "Template supprimé avec succès" });

    } catch (err) {
        console.error("deleteEmailTemplate error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
