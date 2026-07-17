import {Router} from 'express';

import {getProducts, getProductById, createProduct, updateProduct, deleteProduct} from './product.controller.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

const router = Router();

// obtener todos los productos
router.get('/', getProducts);

// obtener un producto por ID
router.get('/:id', getProductById);

// crear un producto
router.post('/', validateJWT, createProduct);

// actualizar un producto
router.put('/:id', validateJWT, updateProduct);

// eliminar un producto
router.delete('/:id', validateJWT, deleteProduct);

export default router;