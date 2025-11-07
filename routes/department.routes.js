import express from "express";
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - department_name
 *       properties:
 *         id:
 *           type: integer
 *         department_name:
 *           type: string
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Récupère tous les départements
 *     responses:
 *       200:
 *         description: Liste des départements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 */
router.get("/", getDepartments);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Récupère un département par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Département trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 */
router.get("/:id", getDepartmentById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Crée un nouveau département
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       201:
 *         description: Département créé
 */
router.post("/", createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Met à jour un département par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Département mis à jour
 */
router.put("/:id", updateDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Supprime un département par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Département supprimé
 */
router.delete("/:id", deleteDepartment);

export default router;
