import 'dotenv/config'; 

import { initApp } from './configs/app.js';
import { dbConnection } from './configs/database.js';

const app = initApp();
const PORT = process.env.PORT || 3006;

const startServer = async () => {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`Servicios y reportes corriendo en puerto ${PORT}`);
  });
};

startServer();