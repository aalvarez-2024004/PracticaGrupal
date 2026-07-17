'use strict';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5436,
  database: process.env.DB_NAME || 'IAuth',
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  logging: process.env.DB_SQL_LOGGING === 'true' ? console.log : false,
  define: {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const dbConnection = async () => {
  try {
    console.log('PostgreSQL | Intentando conectar...');
    await sequelize.authenticate();
    console.log('PostgreSQL | Conectado a PostgreSQL exitosamente');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('PostgreSQL | Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('PostgreSQL | Error de conexión:', error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`PostgreSQL | Recibida señal ${signal}. Cerrando conexión...`);
  try {
    await sequelize.close();
    console.log('PostgreSQL | Conexión cerrada limpiamente');
    process.exit(0);
  } catch (error) {
    console.error('PostgreSQL | Error al cerrar la conexión:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));