import { Router } from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "./categoria.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", validateJWT, getCategories);
router.post("/", validateJWT, createCategory);
router.put("/:id", validateJWT, updateCategory);
router.delete("/:id", validateJWT, deleteCategory);

export default router;
