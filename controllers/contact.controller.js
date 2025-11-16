import models from "../models/index.js";

const { Contact, Organization, Department, Language } = models;

export const createContact = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const contact = await Contact.create({
            ...req.body,
            userId: user
        });

        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const contacts = await Contact.findAll({
            where: { userId: user },
            include: [
                { model: Organization, as: "organization" },
                { model: Department, as: "department" },
                {model: Language, as: "language"}
            ],
        });

        res.json(contacts);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getContactById = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const contact = await Contact.findOne({
            where: { id: req.params.id, userId: user },
            include: [
                { model: Organization, as: "organization" },
                { model: Department, as: "department" },
                {model: Language, as : "language"}
            ],
        });

        if (!contact)
            return res.status(404).json({ message: "Contact not found or access denied" });

        res.json(contact);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateContact = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const contact = await Contact.findOne({
            where: { id: req.params.id, userId: user }
        });

        if (!contact)
            return res.status(404).json({ message: "Contact not found or access denied" });

        const { userId, ...updateData } = req.body;

        await contact.update(updateData);

        res.json(contact);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const user = req.user?.id;
        if (!user) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const contact = await Contact.findOne({
            where: { id: req.params.id, userId: user }
        });

        if (!contact)
            return res.status(404).json({ message: "Contact not found or access denied" });

        await contact.destroy();

        res.json({ message: "Contact deleted" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
