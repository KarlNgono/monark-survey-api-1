import express from "express";
import {
    createOrganization,
    getOrganizations,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
} from "../controllers/organization.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getOrganizations);
router.get("/:id", getOrganizationById);
router.post("/", createOrganization);
router.put("/:id", updateOrganization);
router.delete("/:id", deleteOrganization);

export default router;
