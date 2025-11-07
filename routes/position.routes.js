import express from "express";
import {
    createPosition,
    getPositions,
    getPositionById,
    updatePosition,
    deletePosition,
} from "../controllers/position.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Position:
 *       type: object
 *       required:
 *         - label
 *       properties:
 *         id:
 *           type: integer
 *         label:
 *           type: string
 */

/**
 * @swagger
 * /positions:
 *   get:
 *     summary: Récupère toutes les positions
 *     responses:
 *       200:
 *         description: Liste des positions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Position'
 */
router.get("/", getPositions);

/**
 * @swagger
 * /positions/{id}:
 *   get:
 *     summary: Récupère une position par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Position trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Position'
 */
router.get("/:id", getPositionById);

/**
 * @swagger
 * /positions:
 *   post:
 *     summary: Crée une nouvelle position
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       201:
 *         description: Position créée
 */
router.post("/", createPosition);

/**
 * @swagger
 * /positions/{id}:
 *   put:
 *     summary: Met à jour une position par ID
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
 *             $ref: '#/components/schemas/Position'
 *     responses:
 *       200:
 *         description: Position mise à jour
 */
router.put("/:id", updatePosition);

/**
 * @swagger
 * /positions/{id}:
 *   delete:
 *     summary: Supprime une position par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Position supprimée
 */
router.delete("/:id", deletePosition);

export default router;
