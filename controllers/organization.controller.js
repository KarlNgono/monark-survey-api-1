import models from "../models/index.js";
const { Organization, Department } = models;

export const createOrganization = async (req, res) => {
    try {
        const organization = await Organization.create(req.body);
        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.findAll({
            include: [{ model: Department, as: "departments" }],
        });
        res.json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id, {
            include: [{ model: Department, as: "departments" }],
        });
        if (!org) return res.status(404).json({ message: "Organisation non trouvée" });
        res.json(org);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrganization = async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id);
        if (!org) return res.status(404).json({ message: "Organisation non trouvée" });
        await org.update(req.body);
        res.json(org);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        const org = await Organization.findByPk(req.params.id);
        if (!org) return res.status(404).json({ message: "Organisation non trouvée" });
        await org.destroy();
        res.json({ message: "Organisation supprimée" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
