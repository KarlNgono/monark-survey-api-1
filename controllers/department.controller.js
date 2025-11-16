import models from "../models/index.js";
const { Department, Organization, Contact } = models;

export const createDepartment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const org = await Organization.findOne({
            where: { id: req.body.organization_id, userId }
        });

        if (!org) return res.status(403).json({ message: "Accès refusé à cette organisation" });

        const dept = await Department.create({
            ...req.body,
            userId
        });

        return res.status(201).json(dept);

    } catch (err) {
        console.error("Erreur création département :", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const depts = await Department.findAll({
            include: [
                { model: Organization, as: "organization" },
                { model: Contact, as: "contacts" }
            ],
            order: [["id", "DESC"]]
        });

        return res.json(depts);

    } catch (err) {
        console.error("Erreur récupération départements :", err);
        return res.status(500).json({ message: err.message });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const dept = await Department.findOne({
            where: { id: req.params.id },
            include: [
                { model: Organization, as: "organization" },
                { model: Contact, as: "contacts" }
            ]
        });

        if (!dept)
            return res.status(404).json({ message: "Département introuvable ou accès refusé" });

        return res.json(dept);

    } catch (err) {
        console.error("Erreur récupération département :", err);
        return res.status(500).json({ message: err.message });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const dept = await Department.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Organization,
                    as: "organization",
                    where: { userId }
                }
            ]
        });

        if (!dept)
            return res.status(404).json({ message: "Département introuvable ou accès refusé" });

        const { userId: ignored, ...updateData } = req.body;

        await dept.update(updateData);

        return res.json(dept);

    } catch (err) {
        console.error("Erreur mise à jour département :", err);
        return res.status(500).json({ message: err.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: "Utilisateur non authentifié" });

        const dept = await Department.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Organization,
                    as: "organization",
                    where: { userId }
                }
            ]
        });

        if (!dept)
            return res.status(404).json({ message: "Département introuvable ou accès refusé" });

        await dept.destroy();

        return res.json({ message: "Département supprimé avec succès" });

    } catch (err) {
        console.error("Erreur suppression département :", err);
        return res.status(500).json({ message: err.message });
    }
};
