import crypto from "crypto";
import {Op} from "sequelize";
import db from "../models/index.js";
import jwt from "jsonwebtoken";

const Link = db.Link;

export const createGeneralLink = async (req, res) => {
    try {
        const {surveyId, maxUses = null, expiresAt = null} = req.body;
        if (!surveyId) return res.status(400).json({message: "surveyId requis"});

        const code = crypto.randomBytes(6).toString("hex");

        const link = await Link.create({
            code,
            surveyId,
            type: "general",
            maxUses: maxUses || 0,
            expiresAt,
            closeOnSubmit: false
        });

        res.json({
            message: "Lien général créé avec succès",
            url: `${process.env.FRONTEND_URL}/survey/${code}`,
            link
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Erreur serveur"});
    }
};


export const createPrivateLink = async (req, res) => {
    try {
        const { surveyId, contacts } = req.body;

        if (!surveyId || !contacts || !Array.isArray(contacts) || contacts.length === 0) {
            return res.status(400).json({ message: "surveyId et contacts requis" });
        }

        const links = [];

        for (const contact of contacts) {
            if (!contact.contactId) continue;

            const code = crypto.randomBytes(6).toString("hex");

            await Link.create({
                code,
                surveyId,
                contactId: contact.contactId,
                type: "private",
                maxUses: 0,
                closeOnSubmit: true
            });

            links.push({
                contactId: contact.contactId,
                url: `${process.env.FRONTEND_URL}/survey/${code}`
            });
        }

        res.json({
            message: "Liens privés générés pour la liste de contacts",
            links
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const createEphemeralLink = async (req, res) => {
    try {
        const { surveyId, count = 1 } = req.body;

        if (!surveyId) {
            return res.status(400).json({ message: "surveyId requis" });
        }

        const links = Array.from({ length: count }, () => {
            const token = jwt.sign(
                {
                    surveyId,
                    nonce: crypto.randomBytes(8).toString("hex")
                },
                process.env.LINK_SECRET,
                { expiresIn: "24h" }
            );

            return {
                url: `${process.env.FRONTEND_URL}/survey/temp/${token}`
            };
        });

        res.json({
            message: "Liens éphémères anonymes générés",
            links
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const validateLink = async (req, res) => {
    try {
        const {code} = req.params;
        const link = await Link.findOne({
            where: {
                code,
                isActive: true,
                [Op.or]: [
                    {expiresAt: null},
                    {expiresAt: {[Op.gt]: new Date()}}
                ]
            }
        });

        if (!link) return res.status(404).json({message: "Lien invalide ou expiré"});

        if (link.maxUses && link.uses >= link.maxUses) {
            return res.status(403).json({message: "Ce lien a déjà été utilisé"});
        }

        res.json({valid: true, surveyId: link.surveyId, type: link.type});
    } catch (err) {
        res.status(500).json({message: "Erreur serveur"});
    }
};

export const validateEphemeralLink = (req, res) => {
    try {
        const {token} = req.params;
        const decoded = jwt.verify(token, process.env.LINK_SECRET);

        res.json({valid: true, surveyId: decoded.surveyId});
    } catch (err) {
        res.status(400).json({message: "Lien éphémère invalide ou expiré"});
    }
};

export const markLinkUsed = async (code) => {
    const link = await Link.findOne({where: {code}});
    if (!link) return;

    link.uses += 1;
    if ((link.maxUses && link.uses >= link.maxUses) || link.closeOnSubmit) {
        link.isActive = false;
    }

    await link.save();
};
