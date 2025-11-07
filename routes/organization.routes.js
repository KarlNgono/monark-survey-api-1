import express from "express";
import {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
} from "../controllers/organization.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Organization:
 *       type: object
 *       required:
 *         - organization_name
 *       properties:
 *         id:
 *           type: integer
 *         industry:
 *           type: string
 *         organization_type:
 *           type: string
 *         organization_name:
 *           type: string
 *         team:
 *           type: string
 *         region:
 *           type: string
 *         city:
 *           type: string
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: Récupère toutes les organisations
 *     responses:
 *       200:
 *         description: Liste des organisations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get("/", getOrganizations);

router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

export default router;
