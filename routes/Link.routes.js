import express from "express";
import {
    createGeneralLink,
    createPrivateLink,
    createEphemeralLink,
    validateLink,
    validateEphemeralLink
} from "../controllers/Link.controller.js";

const router = express.Router();

router.post("/links/general", createGeneralLink);
router.post("/links/private", createPrivateLink);
router.post("/links/temp", createEphemeralLink);

router.get("/links/:code/validate", validateLink);
router.get("/links/temp/:token/validate", validateEphemeralLink);

export default router;
