import express from "express";
import {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
} from "../controllers/contact.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getContacts);
router.get("/:id", getContactById);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
