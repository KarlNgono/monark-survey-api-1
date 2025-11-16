import express from "express";
import {authMiddleware} from "../helpers/authMiddleware.js";
import {
    createLanguage,
    getAllLanguages,
    getLanguageById,
    updateLanguage,
    deleteLanguage
} from "../controllers/language.controller.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getAllLanguages);
router.get("/:id", getLanguageById);

router.post("/", createLanguage);
router.put("/:id", updateLanguage);
router.delete("/:id", deleteLanguage);

export default router;
