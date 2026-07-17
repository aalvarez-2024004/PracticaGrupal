import { sequelize } from '../../configs/database.js'
import { initUserModel } from '../users/user.model.js'

// Inicializamos únicamente el modelo de Usuario
const User = initUserModel(sequelize)

export { sequelize, User }