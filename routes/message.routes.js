import express from "express";
import {
    sendContactSurvey,
    sendSegmentSurvey
} from "../controllers/message.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post(
    "/contact/:contactId/:surveyId/:emailTemplateId",
    sendContactSurvey
);


router.post(
    "/segment/:segmentId/:surveyId/:emailTemplateId",
    sendSegmentSurvey
);

export default router;
