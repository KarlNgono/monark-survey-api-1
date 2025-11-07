import models from "../models/index.js";
const { Contact, Language, Organization, Department, Position } = models;

export const createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll({
            include: [
                { model: Language, as: "language" },
                { model: Organization, as: "organization" },
                { model: Department, as: "department" },
                { model: Position, as: "position" },
            ],
        });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getContactById = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id, {
            include: [
                { model: Language, as: "language" },
                { model: Organization, as: "organization" },
                { model: Department, as: "department" },
                { model: Position, as: "position" },
            ],
        });
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        await contact.update(req.body);
        res.json(contact);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByPk(req.params.id);
        if (!contact) return res.status(404).json({ message: "Contact not found" });
        await contact.destroy();
        res.json({ message: "Contact deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
