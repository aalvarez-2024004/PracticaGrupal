import { Router } from 'express'
import { updateMyPassword } from './user.controller.js'
import { validateJWT } from '../../middlewares/validate-jwt.js'

const router = Router()

// Endpoint para que cualquier usuario autenticado cambie su contraseña
router.patch(
  '/change-password',
  validateJWT,
  updateMyPassword
)

export default router