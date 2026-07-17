import { User } from '../models/index.js'
import { hashPassword, comparePassword } from '../../helpers/hash-password.js'
import { generateJWT } from '../../helpers/generate-jwt.js'
import { generateVerificationToken } from '../../helpers/generate-verification-token.js'
import { sendVerificationEmail, sendResetPasswordEmail } from '../../helpers/send-email.js'
import jwt from 'jsonwebtoken'
import { config } from '../../configs/config.js'
import crypto from 'crypto'

export const registerUser = async (data) => {
  const { name, email, password } = data

  // Validaciones de campos vacíos
  if (!name || !name.trim()) throw new Error('El nombre es requerido')
  if (!email || !email.trim()) throw new Error('El correo es requerido')
  if (!password || !password.trim()) throw new Error('La contraseña es requerida')

  if (password.trim().length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres')
  }

  // Verificar duplicados
  const emailExists = await User.findOne({
    where: { email: email.trim() }
  })
  if (emailExists) throw new Error('El correo ya está registrado')

  const hashedPassword = await hashPassword(password.trim())

  // Para el inventario activamos la cuenta de inmediato;
  // el correo de verificación sigue disponible como refuerzo opcional.
  const user = await User.create({
    name: name.trim(),
    email: email.trim(),
    password: hashedPassword,
    isActive: true
  })

  const verificationToken = generateVerificationToken(user)
  sendVerificationEmail(user.email, verificationToken).catch((err) => {
    console.error(`No se pudo enviar correo de verificación a ${user.email}:`, err.message)
  })

  const token = generateJWT(user)

  const userWithoutPassword = user.toJSON()
  delete userWithoutPassword.password

  return {
    success: true,
    message: 'Usuario registrado exitosamente',
    user: userWithoutPassword,
    token,
    verificationToken
  }
}

export const loginUser = async (email, password) => {
  if (!email || !email.trim()) throw new Error('El correo es requerido')
  if (!password || !password.trim()) throw new Error('La contraseña es requerida')

  const user = await User.findOne({
    where: { email: email.trim() }
  })

  if (!user) throw new Error('Credenciales inválidas')

  // Comparación usando argon2
  const validPassword = await comparePassword(password.trim(), user.password)
  if (!validPassword) throw new Error('Credenciales inválidas')

  // Validar si la cuenta está verificada
  if (!user.isActive) {
    throw new Error('Cuenta no verificada. Revisa tu correo')
  }

  const token = generateJWT(user)

  const userWithoutPassword = user.toJSON()
  delete userWithoutPassword.password

  return { token, user: userWithoutPassword }
}

export const verifyAccount = async (token) => {
  try {
    const { uid } = jwt.verify(token, config.jwt.secret)

    const user = await User.findByPk(uid)
    if (!user) throw new Error('Usuario no encontrado')

    if (!user.isActive) {
      user.isActive = true
      await user.save()
    }

    const authToken = generateJWT(user)

    const userWithoutPassword = user.toJSON()
    delete userWithoutPassword.password

    return {
      message: 'Cuenta verificada correctamente',
      token: authToken,
      user: userWithoutPassword
    }
  } catch (error) {
    throw new Error('Token inválido o expirado')
  }
}

export const getUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ['password'] }
  })
}

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email: email.trim() } })

  if (!user) {
    return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' }
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

  await user.update({
    resetPasswordToken: resetToken,
    resetPasswordExpiry: resetTokenExpiry
  })

  await sendResetPasswordEmail(user.email, user.name, resetToken)

  return { message: 'Si el correo existe, recibirás un enlace para restablecer tu contraseña.' }
}

export const resetPasswordService = async (token, newPassword) => {
  if (!token || !newPassword) throw new Error('Token y nueva contraseña son requeridos')
  if (newPassword.trim().length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres')

  const user = await User.findOne({ where: { resetPasswordToken: token } })

  if (!user) throw new Error('Token inválido o expirado')

  if (new Date() > new Date(user.resetPasswordExpiry)) {
    throw new Error('El enlace ha expirado. Solicita uno nuevo.')
  }

  const hashedPassword = await hashPassword(newPassword.trim())

  await user.update({
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpiry: null
  })

  return { message: 'Contraseña actualizada correctamente' }
}