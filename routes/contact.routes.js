import express from "express";
import {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         contact_type:
 *           type: string
 *         contact_value:
 *           type: string
 *         organization_id:
 *           type: integer
 *         department_id:
 *           type: integer
 *         position_id:
 *           type: integer
 *         language_id:
 *           type: integer
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupère tous les contacts
 *     responses:
 *       200:
 *         description: Liste de contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 */
router.get("/", getContacts);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Récupère un contact par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.get("/:id", getContactById);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crée un contact
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact créé
 */
router.post("/", createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Met à jour un contact par ID
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
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact mis à jour
 */
router.put("/:id", updateContact);

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprime un contact par ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact supprimé
 */
router.delete("/:id", deleteContact);

export default router;
