import argon2 from 'argon2'

export const hashPassword = async (password) => {
  try {
    return await argon2.hash(password)
  } catch (error) {
    throw new Error('Error al cifrar la contraseña')
  }
}

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await argon2.verify(hashedPassword, password)
  } catch (error) {
    throw new Error('Error al verificar la contraseña')
  }
}