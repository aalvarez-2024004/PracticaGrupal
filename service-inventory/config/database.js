'use strict';

import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.log('MongoDB | no se pudo conectar a mongodb');
            mongoose.disconnect();
        });

        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | intentando conectar a mongodb');
        })

        mongoose.connection.on('connected', () => {
            console.log('MongoDB | conectado a mongoDB');
        });

        mongoose.connection.on( 'open', () => {
            console.log('MongoDB | conexión abierta a la base de datos de inventario');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | reconectado a mongoDB');
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | desconectado de mongoDB');
        });
        
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
        
    } catch (error) {
        console.log(`Error al conectar la db: ${error}`);    
    }
}