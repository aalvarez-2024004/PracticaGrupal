'use strict';
import axios from 'axios';
import AlertLog from './alerts.model.js';

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;

// Límite para considerar que un producto tiene bajo inventario
const LOW_STOCK_LIMIT = 5;

const obtenerProductosDesdeInventario = async (token) => {
    if (!INVENTORY_URL) {
        throw new Error("La variable de entorno INVENTORY_SERVICE_URL no está configurada.");
    }

    // Validación segura para evitar crasheos si el token no viene en los headers
    const formattedToken = token && token.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');

    const response = await axios.get(`${INVENTORY_URL}/productos`, {
        headers: { 
            'Authorization': formattedToken,
            'Accept': 'application/json'
        }
    });

    const data = response.data;

    // Adaptador flexible por si tu servicio de inventario envuelve los datos en diferentes estructuras
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.productos && Array.isArray(data.productos)) return data.productos;
    if (data.products && Array.isArray(data.products)) return data.products;

    throw new Error("El servicio de inventario no devolvió un formato de array válido.");
};


export const getLowStock = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const productos = await obtenerProductosDesdeInventario(token);

        // Mapeado directo a tu propiedad del modelo de inventario: 'existencia'
        const productosBajoStock = productos.filter(
            (p) => p.existencia > 0 && p.existencia <= LOW_STOCK_LIMIT
        );

        if (productosBajoStock.length > 0) {
            const registros = productosBajoStock.map((p) => ({
                type: 'BAJO_STOCK',
                productId: p._id || p.id,
                productName: p.nombre,    
                category: p.categoria,    
                stock: p.existencia,       
                checkedBy: req.user.id     
            }));

            // Inserción masiva eficiente en MongoDB
            await AlertLog.insertMany(registros);
        }

        return res.status(200).json({
            success: true,
            message: 'Productos con bajo inventario procesados y registrados con éxito',
            total: productosBajoStock.length,
            data: productosBajoStock.map((p) => ({
                id: p._id || p.id,
                producto: p.nombre,
                existencia: p.existencia,
                categoria: p.categoria
            }))
        });

    } catch (error) {
        console.error("Error en getLowStock:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos con bajo inventario',
            error: error.response?.data?.message || error.message
        });
    }
};

export const getOutOfStock = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const productos = await obtenerProductosDesdeInventario(token);

        // Mapeado directo a tu propiedad del modelo de inventario: 'existencia'
        const productosAgotados = productos.filter((p) => p.existencia === 0);

        // Si hay productos totalmente agotados, registramos las alertas críticas
        if (productosAgotados.length > 0) {
            const registros = productosAgotados.map((p) => ({
                type: 'AGOTADO',
                productId: p._id || p.id,
                productName: p.nombre,
                category: p.categoria,
                stock: 0,
                checkedBy: req.user.id
            }));

            await AlertLog.insertMany(registros);
        }

        return res.status(200).json({
            success: true,
            message: 'Productos agotados procesados y registrados con éxito',
            total: productosAgotados.length,
            data: productosAgotados.map((p) => ({
                id: p._id || p.id,
                producto: p.nombre,
                existencia: 0,
                categoria: p.categoria
            }))
        });

    } catch (error) {
        console.error("Error en getOutOfStock:", error.message);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener productos agotados',
            error: error.response?.data?.message || error.message
        });
    }
};