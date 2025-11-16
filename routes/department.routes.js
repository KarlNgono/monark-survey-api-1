import express from "express";
import {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} from "../controllers/department.controller.js";
import {authMiddleware} from "../helpers/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export default router;
