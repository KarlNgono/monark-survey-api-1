import express from "express";
import {createSegment, deleteSegment, getSegments, updateSegment} from "../controllers/segment.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Segment:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           description: Identifiant unique du segment
 *         name:
 *           type: string
 *           description: Nom du segment
 *         description:
 *           type: string
 *           description: Description du segment
 *         type:
 *           type: string
 *           enum: [manual, dynamic]
 *           description: Type du segment (manuel ou dynamique)
 *         filter_rules:
 *           type: object
 *           nullable: true
 *           description: Règles de filtrage pour les segments dynamiques (en JSON)
 *           example:
 *             and:
 *               - { field: "region", operator: "=", value: "Europe" }
 *               - { field: "gender", operator: "=", value: "F" }
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /segments:
 *   get:
 *     summary: Récupère la liste de tous les segments
 *     tags: [Segments]
 *     responses:
 *       200:
 *         description: Liste des segments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Segment'
 */
router.get("/", getSegments);

/**
 * @swagger
 * /segments/{id}:
 *   get:
 *     summary: Récupère un segment spécifique par son ID
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du segment
 *     responses:
 *       200:
 *         description: Segment trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Segment'
 *       404:
 *         description: Segment introuvable
 */
router.get("/:id", getSegments);

/**
 * @swagger
 * /segments:
 *   post:
 *     summary: Crée un nouveau segment
 *     tags: [Segments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segment'
 *           example:
 *             name: "Femmes francophones"
 *             description: "Femmes parlant français en Europe"
 *             type: "dynamic"
 *             filter_rules:
 *               and:
 *                 - { field: "gender", operator: "=", value: "F" }
 *                 - { field: "language_id", operator: "=", value: 1 }
 *     responses:
 *       201:
 *         description: Segment créé avec succès
 *       400:
 *         description: Requête invalide
 */
router.post("/", createSegment);

/**
 * @swagger
 * /segments/{id}:
 *   put:
 *     summary: Met à jour un segment existant
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du segment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Segment'
 *           example:
 *             name: "Clients Premium"
 *             description: "Mise à jour du segment"
 *             type: "manual"
 *             contact_ids: [2, 5, 9]
 *     responses:
 *       200:
 *         description: Segment mis à jour avec succès
 *       404:
 *         description: Segment non trouvé
 */
router.put("/:id", updateSegment);
/**
 * @swagger
 * /segments/{id}:
 *   delete:
 *     summary: Supprime un segment existant
 *     tags: [Segments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Identifiant du segment à supprimer
 *     responses:
 *       200:
 *         description: Segment supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Segment deleted
 *       404:
 *         description: Segment non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Segment introuvable
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur interne
 */
router.delete("/:id", deleteSegment);

export default router;
