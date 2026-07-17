'use strict';

import { Router } from 'express';
import { getLowStock, getOutOfStock } from './alerts.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js'

const router = Router();

router.get(
    '/low-stock',
    validateJWT,
    getLowStock
);

router.get(
    '/out-of-stock',
    validateJWT,
    getOutOfStock
);

export default router;