import models from "../models/index.js";
import {Op} from "sequelize";
import {validateFilterRules} from "../helpers/filterRulesValidation.js";

const {Segment, Contact, ContactSegment} = models;


const buildWhere = (rules) => {
    if (!rules) return {};

    if (rules.and) return {[Op.and]: rules.and.map(buildWhere)};
    if (rules.or) return {[Op.or]: rules.or.map(buildWhere)};

    if (rules.field && rules.operator !== undefined) {
        const {field, operator, value} = rules;

        const ops = {
            "=": value,
            "!=": {[Op.ne]: value},
            ">": {[Op.gt]: value},
            "<": {[Op.lt]: value},
            ">=": {[Op.gte]: value},
            "<=": {[Op.lte]: value},
            "IN": {[Op.in]: value},
            "NOT IN": {[Op.notIn]: value},
            "LIKE": {[Op.like]: `%${value}%`},
            "NOT LIKE": {[Op.notLike]: `%${value}%`}
        };

        return {[field]: ops[operator] ?? value};
    }

    if (typeof rules === "object") {
        return Object.fromEntries(
            Object.entries(rules).map(([key, val]) => {
                if (Array.isArray(val)) return [key, {[Op.in]: val}];
                return [key, val];
            })
        );
    }

    return {};
};


export const createSegment = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({message: "User not authenticated"});

        const {name, description, type, filterRules, contact_ids} = req.body;

        if (!name || !type) {
            return res.status(400).json({message: "name and type are not found"});
        }

        if (!["manual", "dynamic"].includes(type)) {
            return res.status(400).json({message: "Type invalid : manual | dynamic"});
        }

        if (type === "dynamic") {
            validateFilterRules(filterRules);
        }
        const segment = await Segment.create({
            name,
            description,
            type,
            filterRules: type === "dynamic" ? filterRules : null,
            userId,
        });

        if (type === "manual" && Array.isArray(contact_ids) && contact_ids.length > 0) {
            const associations = contact_ids.map(cid => ({
                contact_id: cid,
                segment_id: segment.id
            }));

            await ContactSegment.bulkCreate(associations);
        }

        if (type === "dynamic" && filterRules) {
            const where = buildWhere(filterRules);

            const contacts = await Contact.findAll({
                where: {...where, userId}
            });

            if (contacts.length > 0) {
                const associations = contacts.map(c => ({
                    contact_id: c.id,
                    segment_id: segment.id
                }));
                await ContactSegment.bulkCreate(associations);
            }
        }

        return res.status(201).json({
            message: "Segment créé avec succès",
            segment
        });

    } catch (error) {
        console.error("Erreur création segment :", error);
        return res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const getSegments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({message: "Utilisateur non authentifié"});

        const {id} = req.params;

        if (id) {
            const segment = await Segment.findOne({
                where: {id, userId},
                include: [
                    {
                        model: Contact,
                        as: "contacts",
                        through: {attributes: []}
                    }
                ]
            });

            if (!segment) {
                return res.status(404).json({message: "Segment introuvable"});
            }

            return res.json(segment);
        }

        const segments = await Segment.findAll({
            where: {userId},
            include: [
                {
                    model: Contact,
                    as: "contacts",
                    through: {attributes: []}
                }
            ]
        });

        return res.json(segments);

    } catch (error) {
        console.error("Erreur récupération segments :", error);
        return res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const updateSegment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({message: "Utilisateur non authentifié"});

        const {id} = req.params;
        const {name, description, type, filterRules, contact_ids} = req.body;

        const segment = await Segment.findOne({where: {id, userId}});
        if (!segment) {
            return res.status(404).json({message: "Segment introuvable"});
        }

        segment.name = name ?? segment.name;
        segment.description = description ?? segment.description;
        segment.type = type ?? segment.type;
        segment.filterRules = segment.type === "dynamic" ? filterRules : null;

        await segment.save();

        await ContactSegment.destroy({where: {segment_id: id}});

        if (segment.type === "manual" && Array.isArray(contact_ids)) {
            const associations = contact_ids.map(cid => ({
                contact_id: cid,
                segment_id: id
            }));
            await ContactSegment.bulkCreate(associations);
        }
        if (segment.type === "dynamic" && filterRules) {
            const where = buildWhere(filterRules);

            const contacts = await Contact.findAll({
                where: {...where, userId}
            });

            const associations = contacts.map(c => ({
                contact_id: c.id,
                segment_id: id
            }));

            if (associations.length > 0) {
                await ContactSegment.bulkCreate(associations);
            }
        }

        return res.json({
            message: "Segment mis à jour avec succès",
            segment
        });

    } catch (error) {
        console.error("Erreur modification segment :", error);
        return res.status(500).json({message: "Erreur interne", error: error.message});
    }
};

export const deleteSegment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({message: "Utilisateur non authentifié"});

        const {id} = req.params;

        const segment = await Segment.findOne({where: {id, userId}});
        if (!segment) {
            return res.status(404).json({message: "Segment introuvable"});
        }

        await ContactSegment.destroy({where: {segment_id: id}});
        await segment.destroy();

        return res.json({message: "Segment supprimé avec succès"});

    } catch (error) {
        console.error("Erreur suppression segment :", error);
        return res.status(500).json({message: "Erreur interne", error: error.message});
    }
};
