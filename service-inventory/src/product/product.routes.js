import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "./product.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.get("/", validateJWT, getProducts);
router.get("/:id", validateJWT, getProductById);
router.post("/", validateJWT, createProduct);
router.put("/:id", validateJWT, updateProduct);
router.delete("/:id", validateJWT, deleteProduct);

export default router;
