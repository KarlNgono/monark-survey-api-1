import express from "express";
import {authMiddleware} from "../helpers/authMiddleware.js";
import {
    createEmailTemplate,
    getEmailTemplates,
    getEmailTemplateById,
    updateEmailTemplate,
    deleteEmailTemplate
} from "../controllers/emailTemplate.controller.js";

const router = express.Router();
router.use(authMiddleware);


router.post("/", createEmailTemplate);
router.get("/", getEmailTemplates);
router.get("/:id", getEmailTemplateById);
router.put("/:id", updateEmailTemplate);
router.delete("/:id", deleteEmailTemplate);

export default router;
