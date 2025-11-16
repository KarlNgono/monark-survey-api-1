import models from "../models/index.js";
const { Organization, Department } = models;

export const createOrganization = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const { name, industry, type, team, region, city } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Le nom de l'organisation est obligatoire" });
        }

        const organization = await Organization.create({
            name,
            industry,
            type,
            team,
            region,
            city,
            userId
        });

        return res.status(201).json(organization);

    } catch (error) {
        console.error("Erreur création organisation :", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getOrganizations = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const organizations = await Organization.findAll({
            include: [{ model: Department, as: "departments" }],
            order: [["id", "DESC"]]
        });

        return res.json(organizations);

    } catch (error) {
        console.error("Erreur récupération organisations :", error);
        return res.status(500).json({ message: error.message });
    }
};

export const getOrganizationById = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const org = await Organization.findOne({
            where: { id: req.params.id },
            include: [{ model: Department, as: "departments" }]
        });

        if (!org) {
            return res.status(404).json({ message: "Organisation introuvable ou accès refusé" });
        }

        return res.json(org);

    } catch (error) {
        console.error("Erreur récupération organisation :", error);
        return res.status(500).json({ message: error.message });
    }
};

export const updateOrganization = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const org = await Organization.findOne({
            where: { id: req.params.id, userId }
        });

        if (!org) {
            return res.status(404).json({ message: "Organisation introuvable ou accès refusé" });
        }

        const { userId: ignoredUserId, createdby: ignored2, ...updateData } = req.body;

        await org.update(updateData);

        return res.json(org);

    } catch (error) {
        console.error("Erreur mise à jour organisation :", error);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteOrganization = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Utilisateur non authentifié" });
        }

        const org = await Organization.findOne({
            where: { id: req.params.id, userId }
        });

        if (!org) {
            return res.status(404).json({ message: "Organisation introuvable ou accès refusé" });
        }

        await org.destroy();

        return res.json({ message: "Organisation supprimée avec succès" });

    } catch (error) {
        console.error("Erreur suppression organisation :", error);
        return res.status(500).json({ message: error.message });
    }
};
