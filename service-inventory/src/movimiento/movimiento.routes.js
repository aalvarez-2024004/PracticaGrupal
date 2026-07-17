import { Router } from "express";
import { createEntry, createOutput, getMovements } from "./movimiento.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router();

router.post("/entradas", validateJWT, createEntry);
router.post("/salidas", validateJWT, createOutput);
router.get("/movimientos", validateJWT, getMovements);

export default router;
