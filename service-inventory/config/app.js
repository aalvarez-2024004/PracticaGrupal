'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import productRoutes from '../src/product/product.routes.js';

const BASE_PATH = '/inventarios/v1';

export const initApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));

  // Endpoint de prueba
  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      service: 'Gestor de inventario funcionando',
      timestamp: new Date().toISOString()
    });
  });

  app.use(`${BASE_PATH}/productos`, productRoutes);

  return app;
};