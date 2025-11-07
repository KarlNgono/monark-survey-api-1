import express from "express";
import { sendContactSurvey, sendSegmentSurvey } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/contact/:contactId/:surveyId", sendContactSurvey);
router.post("/send/segment/:segmentId/:surveyId", sendSegmentSurvey);

export default router;
