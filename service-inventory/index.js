import dotenv from 'dotenv';
import { initApp } from './config/app.js';
import { dbConnection } from './config/database.js';

dotenv.config();

const app = initApp();
const PORT = process.env.PORT || 3005;

const startServer = async () => {
  await dbConnection();

  app.listen(PORT, () => {
    console.log(`Gestor de Inventario corriendo en puerto ${PORT}`);
  });
};

startServer();