import express from "express";
import {
    createEmailContent,
    getEmailContents,
    getEmailContentById,
    updateEmailContent,
    deleteEmailContent
} from "../controllers/emailContent.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, createEmailContent);

router.get("/",authMiddleware, getEmailContents);

router.get("/email-content/:id",authMiddleware, getEmailContentById);

router.put("/email-content/:id", authMiddleware, updateEmailContent);

router.delete("/email-content/:id",authMiddleware, deleteEmailContent);

export default router;
