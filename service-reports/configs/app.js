'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';


const BASE_PATH = '/serviceReports/v1';

export const initApp = () => {
    const app = express();

    app.use(express.json());
    app.use(cors(corsOptions));
    app.use(helmet(helmetConfiguration));
    app.use(morgan('dev'));

    // Registro de rutas para Alertas y Reportes
    app.use(`${BASE_PATH}`, reportsRoutes);

    // Endpoint de prueba / salud
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            service: 'Service B: Alertas y Reportes funcionando',
            timestamp: new Date().toISOString()
        });
    });

    return app;
};