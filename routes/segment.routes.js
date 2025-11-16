import express from "express";
import {createSegment, deleteSegment, getSegments, updateSegment} from "../controllers/segment.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";


const router = express.Router();

router.use(authMiddleware);

router.get("/", getSegments);
router.get("/:id", getSegments);
router.post("/", createSegment);
router.put("/:id", updateSegment);
router.delete("/:id", deleteSegment);

export default router;
