import { User } from '../models/index.js'
import { hashPassword, comparePassword } from '../../helpers/hash-password.js'

export const changePassword = async (userId, currentPassword, newPassword) => {
  if (!currentPassword || !currentPassword.trim()) throw new Error('La contraseña actual es requerida')
  if (!newPassword || !newPassword.trim()) throw new Error('La nueva contraseña es requerida')

  if (newPassword.trim().length < 6) throw new Error('La nueva contraseña debe tener al menos 6 caracteres')

  const user = await User.findByPk(userId)

  if (!user) throw new Error('Usuario no encontrado')

  // Comparación usando argon2 desde el helper
  const isMatch = await comparePassword(currentPassword.trim(), user.password)

  if (!isMatch) throw new Error('Contraseña actual incorrecta')

  const newHashedPassword = await hashPassword(newPassword.trim())

  await user.update({ password: newHashedPassword })

  return { message: 'Contraseña actualizada correctamente' }
}