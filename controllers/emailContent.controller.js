import models from "../models/index.js";
const { EmailContent, EmailTemplate, Language } = models;

export const createEmailContent = async (req, res) => {
    try {
        const { content_text, content_html, emailTemplateId, languageId } = req.body;

        if (!content_text)
            return res.status(400).json({ message: "Le champ 'content_text' est obligatoire." });

        if (!emailTemplateId)
            return res.status(400).json({ message: "emailTemplateId est obligatoire." });

        if (!languageId)
            return res.status(400).json({ message: "languageId est obligatoire." });

        const template = await EmailTemplate.findByPk(emailTemplateId);
        if (!template)
            return res.status(404).json({ message: "EmailTemplate introuvable." });

        const lang = await Language.findByPk(languageId);
        if (!lang)
            return res.status(404).json({ message: "Langue introuvable." });

        const emailContent = await EmailContent.create({
            content_text,
            content_html: content_html || null,
            emailTemplateId,
            languageId
        });

        return res.status(201).json({
            message: "EmailContent créé avec succès",
            emailContent
        });

    } catch (err) {
        console.error("createEmailContent error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};


export const getEmailContents = async (req, res) => {
    try {
        const contents = await EmailContent.findAll({
            include: [
                { model: EmailTemplate, as: "template" },
                { model: Language, as: "language" }
            ]
        });

        return res.json(contents);

    } catch (err) {
        console.error("getEmailContents error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};


export const getEmailContentById = async (req, res) => {
    try {
        const { id } = req.params;

        const content = await EmailContent.findByPk(id, {
            include: [
                { model: EmailTemplate, as: "template" },
                { model: Language, as: "language" }
            ]
        });

        if (!content)
            return res.status(404).json({ message: "EmailContent introuvable." });

        return res.json(content);

    } catch (err) {
        console.error("getEmailContentById error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};


export const updateEmailContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { content_text, content_html, languageId } = req.body;

        const emailContent = await EmailContent.findByPk(id);
        if (!emailContent)
            return res.status(404).json({ message: "EmailContent introuvable." });

        if (languageId) {
            const lang = await Language.findByPk(languageId);
            if (!lang)
                return res.status(404).json({ message: "Langue introuvable." });

            emailContent.languageId = languageId;
        }

        emailContent.content_text = content_text;
        emailContent.content_html = content_html || null;

        await emailContent.save();

        return res.json({
            message: "EmailContent mis à jour avec succès",
            emailContent
        });

    } catch (err) {
        console.error("updateEmailContent error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};


export const deleteEmailContent = async (req, res) => {
    try {
        const { id } = req.params;

        const emailContent = await EmailContent.findByPk(id);
        if (!emailContent)
            return res.status(404).json({ message: "EmailContent introuvable." });

        await emailContent.destroy();

        return res.json({ message: "EmailContent supprimé avec succès" });

    } catch (err) {
        console.error("deleteEmailContent error:", err);
        return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
