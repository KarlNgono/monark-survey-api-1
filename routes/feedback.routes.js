import express from "express";
import upload from "../helpers/upload.js";

import {
    createFeedback,
    getAllFeedback,
    getAllMyFeedback,
    getFeedback,
    updateFeedback,
    deleteFeedback
} from "../controllers/feedback.controller.js";

import { authMiddleware } from "../helpers/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    upload.single("screenshot"),
    createFeedback
);

router.get(
    "/",
    getAllFeedback
);

router.get(
    "/my",
    getAllMyFeedback
);

router.get(
    "/:id",
    getFeedback
);

router.put(
    "/:id",
    upload.single("screenshot"),
    updateFeedback
);

router.delete(
    "/:id",
    deleteFeedback
);

export default router;
