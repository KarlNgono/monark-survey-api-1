import express from "express";
import {
    createLanguage,
    getLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage,
} from "../controllers/language.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Language:
 *       type: object
 *       required:
 *         - language_name
 *       properties:
 *         id:
 *           type: integer
 *         language_name:
 *           type: string
 *         code_iso2:
 *           type: string
 *         code_iso4:
 *           type: string
 */

/**
 * @swagger
 * /languages:
 *   get:
 *     summary: Récupère toutes les langues
 *     responses:
 *       200:
 *         description: Liste des langues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Language'
 */
router.get("/", getLanguages);

/**
 * @swagger
 * /languages/{id}:
 *   get:
 *     summary: Récupère une langue par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Langue trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Language'
 */
router.get("/:id", getLanguageById);

/**
 * @swagger
 * /languages:
 *   post:
 *     summary: Crée une nouvelle langue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       201:
 *         description: Langue créée
 */
router.post("/", createLanguage);

/**
 * @swagger
 * /languages/{id}:
 *   put:
 *     summary: Met à jour une langue par ID
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
 *             $ref: '#/components/schemas/Language'
 *     responses:
 *       200:
 *         description: Langue mise à jour
 */
router.put("/:id", updateLanguage);

/**
 * @swagger
 * /languages/{id}:
 *   delete:
 *     summary: Supprime une langue par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Langue supprimée
 */
router.delete("/:id", deleteLanguage);

export default router;
