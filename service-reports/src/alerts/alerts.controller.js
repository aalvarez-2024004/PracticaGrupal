'use strict';

import axios from 'axios';
import AlertLog from './alerts.model.js';

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;
const LOW_STOCK_LIMIT = parseInt(process.env.LOW_STOCK_THRESHOLD || '5', 10);

export const obtenerProductosDesdeInventario = async (token) => {
  if (!INVENTORY_URL) {
    throw new Error('La variable de entorno INVENTORY_SERVICE_URL no está configurada.');
  }

  const formattedToken = token?.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');

  const response = await axios.get(`${INVENTORY_URL}/productos`, {
    headers: {
      Authorization: formattedToken,
      Accept: 'application/json'
    }
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (data.data && Array.isArray(data.data)) return data.data;
  if (data.productos && Array.isArray(data.productos)) return data.productos;
  if (data.products && Array.isArray(data.products)) return data.products;

  throw new Error('El servicio de inventario no devolvió un formato de array válido.');
};

export const obtenerCategoriasDesdeInventario = async (token) => {
  const formattedToken = token?.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');
  const response = await axios.get(`${INVENTORY_URL}/categorias`, {
    headers: { Authorization: formattedToken, Accept: 'application/json' }
  });
  const data = response.data;
  if (data.categories) return data.categories;
  if (data.data) return data.data;
  return Array.isArray(data) ? data : [];
};

export const obtenerMovimientosDesdeInventario = async (token, tipo = null) => {
  const formattedToken = token?.startsWith('Bearer ') ? token : (token ? `Bearer ${token}` : '');
  const params = tipo ? { tipo } : {};
  const response = await axios.get(`${INVENTORY_URL}/movimientos`, {
    headers: { Authorization: formattedToken, Accept: 'application/json' },
    params
  });
  const data = response.data;
  if (data.movements) return data.movements;
  if (data.data) return data.data;
  return Array.isArray(data) ? data : [];
};

/** Registra alertas sin duplicar el mismo producto+tipo el mismo día */
const registrarAlertasSinDuplicar = async (registros) => {
  const inicioDia = new Date();
  inicioDia.setHours(0, 0, 0, 0);

  for (const registro of registros) {
    const existe = await AlertLog.findOne({
      productId: String(registro.productId),
      type: registro.type,
      createdAt: { $gte: inicioDia }
    });

    if (!existe) {
      await AlertLog.create(registro);
    }
  }
};

export const getLowStock = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const productos = await obtenerProductosDesdeInventario(token);

    const productosBajoStock = productos.filter(
      (p) => p.existencia > 0 && p.existencia <= LOW_STOCK_LIMIT
    );

    if (productosBajoStock.length > 0) {
      await registrarAlertasSinDuplicar(
        productosBajoStock.map((p) => ({
          type: 'BAJO_STOCK',
          productId: p._id || p.id,
          productName: p.nombre,
          category: p.categoria,
          stock: p.existencia,
          checkedBy: req.user?.id || null
        }))
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Productos con bajo inventario obtenidos con éxito',
      threshold: LOW_STOCK_LIMIT,
      total: productosBajoStock.length,
      data: productosBajoStock.map((p) => ({
        id: p._id || p.id,
        producto: p.nombre,
        existencia: p.existencia,
        categoria: p.categoria,
        precio: p.precio
      }))
    });
  } catch (error) {
    console.error('Error en getLowStock:', error.message);
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
    const productosAgotados = productos.filter((p) => p.existencia === 0);

    if (productosAgotados.length > 0) {
      await registrarAlertasSinDuplicar(
        productosAgotados.map((p) => ({
          type: 'AGOTADO',
          productId: p._id || p.id,
          productName: p.nombre,
          category: p.categoria,
          stock: 0,
          checkedBy: req.user?.id || null
        }))
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Productos agotados obtenidos con éxito',
      total: productosAgotados.length,
      data: productosAgotados.map((p) => ({
        id: p._id || p.id,
        producto: p.nombre,
        existencia: 0,
        categoria: p.categoria,
        precio: p.precio
      }))
    });
  } catch (error) {
    console.error('Error en getOutOfStock:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener productos agotados',
      error: error.response?.data?.message || error.message
    });
  }
};
