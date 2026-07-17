'use strict';

import { Router } from 'express';
import {
  getTopProducts,
  getCategoriesReport,
  getSummary,
  getInventoryExcel
} from './reports.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = Router();

router.get('/top-productos', validateJWT, getTopProducts);
router.get('/categorias', validateJWT, getCategoriesReport);
router.get('/resumen', validateJWT, getSummary);
router.get('/excel', validateJWT, getInventoryExcel);

export default router;
