import models from "../models/index.js";

const {Segment, Contact, ContactSegment} = models;

import { Op } from "sequelize";

const buildWhere = (rules) => {
    if (!rules) return {};

    if (rules.and) return { [Op.and]: rules.and.map(buildWhere) };
    if (rules.or) return { [Op.or]: rules.or.map(buildWhere) };

    if (rules.field && rules.operator) {
        const { field, operator, value } = rules;
        switch (operator) {
            case "=": return { [field]: value };
            case "!=": return { [field]: { [Op.ne]: value } };
            case ">": return { [field]: { [Op.gt]: value } };
            case "<": return { [field]: { [Op.lt]: value } };
            case ">=": return { [field]: { [Op.gte]: value } };
            case "<=": return { [field]: { [Op.lte]: value } };
            case "IN": return { [field]: { [Op.in]: value } };
            case "NOT IN": return { [field]: { [Op.notIn]: value } };
            case "LIKE": return { [field]: { [Op.like]: `%${value}%` } };
            case "NOT LIKE": return { [field]: { [Op.notLike]: `%${value}%` } };
            default: return {};
        }
    }
    if (typeof rules === "object") {
        const where = {};
        Object.keys(rules).forEach((key) => {
            const value = rules[key];
            if (Array.isArray(value)) {
                where[key] = { [Op.in]: value };
            } else {
                where[key] = value;
            }
        });
        return where;
    }

    return {};
};

export const createSegment = async (req, res) => {
    try {
        const {name, description, type, filter_rules, contact_ids} = req.body;

        if (!name || !type) return res.status(400).json({message: "Le nom et le type du segment sont obligatoires."});

        const segment = await Segment.create({
            name,
            description,
            type,
            filter_rules: type === "dynamic" ? filter_rules : null,
        });

        if (type === "manual" && Array.isArray(contact_ids) && contact_ids.length > 0) {
            const associations = contact_ids.map(contact_id => ({
                contact_id,
                segment_id: segment.id,
            }));
            await ContactSegment.bulkCreate(associations);
        }

        if (type === "dynamic" && filter_rules) {
            const where = buildWhere(filter_rules);
            const contacts = await Contact.findAll({where});

            if (contacts.length > 0) {
                const associations = contacts.map(contact => ({
                    contact_id: contact.id,
                    segment_id: segment.id,
                }));
                await ContactSegment.bulkCreate(associations);
            }
        }

        res.status(201).json({message: "Segment créé avec succès", segment});

    } catch (error) {
        console.error("Erreur création segment :", error);
        res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const getSegments = async (req, res) => {
    try {
        const {id} = req.params;

        if (id) {
            const segment = await Segment.findByPk(id, {
                include: [
                    {
                        model: Contact,
                        as: "contacts",
                        through: {attributes: []},
                    },
                ],
            });

            if (!segment) return res.status(404).json({message: "Segment introuvable"});

            return res.json(segment);
        }

        const segments = await Segment.findAll({
            include: [
                {
                    model: Contact,
                    as: "contacts",
                    through: {attributes: []},
                },
            ],
        });

        res.json(segments);

    } catch (error) {
        console.error("Erreur récupération segments :", error);
        res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const updateSegment = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, description, type, filter_rules, contact_ids} = req.body;

        const segment = await Segment.findByPk(id);
        if (!segment) return res.status(404).json({message: "Segment introuvable"});

        segment.name = name || segment.name;
        segment.description = description || segment.description;
        segment.type = type || segment.type;
        segment.filter_rules = type === "dynamic" ? filter_rules : null;

        await segment.save();

        await ContactSegment.destroy({where: {segment_id: id}});

        if (type === "manual" && Array.isArray(contact_ids)) {
            const associations = contact_ids.map(contact_id => ({contact_id, segment_id: id}));
            await ContactSegment.bulkCreate(associations);
        }

        if (type === "dynamic" && filter_rules) {
            const where = buildWhere(filter_rules);
            const contacts = await Contact.findAll({where});

            if (contacts.length > 0) {
                const associations = contacts.map(contact => ({contact_id: contact.id, segment_id: id}));
                await ContactSegment.bulkCreate(associations);
            }
        }

        res.json({message: "Segment mis à jour avec succès", segment});

    } catch (error) {
        console.error("Erreur modification segment :", error);
        res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const deleteSegment = async (req, res) => {
    try {
        const {id} = req.params;
        const segment = await Segment.findByPk(id);
        if (!segment) return res.status(404).json({message: "Segment introuvable"});

        await ContactSegment.destroy({where: {segment_id: id}});

        await segment.destroy();

        res.json({message: "Segment supprimé avec succès"});

    } catch (error) {
        console.error("Erreur suppression segment :", error);
        res.status(500).json({message: "Erreur interne", error: error.message});
    }
};
