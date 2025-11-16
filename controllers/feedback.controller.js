import models from "../models/index.js";

const {Feedback} = models;

export const createFeedback = async (req, res) => {
    try {
        const userId = req.user?.id;
        const {type, message} = req.body;

        const screenshot = req.file ? req.file.buffer : null;

        if (!type) {
            return res.status(400).json({message: "Le type de feedback est requis"});
        }

        const feedback = await Feedback.create({
            type,
            message,
            userId: userId || null,
            screenshot
        });

        return res.status(201).json({
            message: "Feedback enregistré avec succès",
            data: feedback
        });
    } catch (error) {
        console.error("createFeedback error:", error);
        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};
export const getFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const feedback = await Feedback.findByPk(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback introuvable" });
        }

        if (userId !== 6 && feedback.userId !== userId) {
            return res.status(403).json({
                message: "Vous n'avez pas la permission d'accéder à ce feedback"
            });
        }

        return res.json(feedback);

    } catch (error) {
        console.error("getFeedback error:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { type, message } = req.body;

        const feedback = await Feedback.findByPk(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback introuvable" });
        }

        if (feedback.userId !== userId) {
            return res.status(403).json({
                message: "Vous ne pouvez modifier que vos propres feedbacks"
            });
        }

        await feedback.update({ type, message });

        if (req.file) {
            await feedback.update({
                screenshot: req.file.buffer
            });
        }

        return res.json({
            message: "Feedback mis à jour",
            data: feedback
        });

    } catch (error) {
        console.error("updateFeedback error:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const feedback = await Feedback.findByPk(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback introuvable" });
        }

        if (feedback.userId !== userId) {
            return res.status(403).json({
                message: "Vous ne pouvez supprimer que vos propres feedbacks"
            });
        }

        await feedback.destroy();

        return res.json({ message: "Feedback supprimé avec succès" });

    } catch (error) {
        console.error("deleteFeedback error:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getAllMyFeedback = async (req, res) => {
    try {
        const userId = req.user.id;

        const feedbacks = await Feedback.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });

        return res.json(feedbacks);

    } catch (error) {
        console.error("getAllMyFeedback error:", error);
        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};

export const getAllFeedback = async (req, res) => {
    try {
        const userId = req.user.id;

        if (userId !== 6) {
            return res.status(403).json({
                message: "Accès refusé : réservé à l'administrateur"
            });
        }

        const feedbacks = await Feedback.findAll({
            order: [["createdAt", "DESC"]]
        });

        return res.json(feedbacks);

    } catch (error) {
        console.error("getAllFeedback error:", error);
        return res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
};

