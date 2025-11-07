import models from "../models/index.js";
const { Department, Position, Organization, Contact } = models;

export const createDepartment = async (req, res) => {
    try {
        const dept = await Department.create(req.body);
        res.status(201).json(dept);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDepartments = async (req, res) => {
    try {
        const depts = await Department.findAll({
            include: [
                { model: Position, as: "positions" },
                { model: Organization, as: "organization" },
                { model: Contact, as: "contacts" },
            ],
        });
        res.json(depts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDepartmentById = async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id, {
            include: [
                { model: Position, as: "positions" },
                { model: Organization, as: "organization" },
                { model: Contact, as: "contacts" },
            ],
        });
        if (!dept) return res.status(404).json({ message: "Department not found" });
        res.json(dept);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateDepartment = async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: "Department not found" });
        await dept.update(req.body);
        res.json(dept);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteDepartment = async (req, res) => {
    try {
        const dept = await Department.findByPk(req.params.id);
        if (!dept) return res.status(404).json({ message: "Department not found" });
        await dept.destroy();
        res.json({ message: "Department deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
