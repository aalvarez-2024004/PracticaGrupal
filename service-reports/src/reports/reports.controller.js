'use strict';

import {
  obtenerProductosDesdeInventario,
  obtenerCategoriasDesdeInventario,
  obtenerMovimientosDesdeInventario
} from '../alerts/alerts.controller.js';
import { buildInventoryExcel } from './excel/inventory-report.js';

const LOW_STOCK_LIMIT = parseInt(process.env.LOW_STOCK_THRESHOLD || '5', 10);

export const getTopProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;
    const salidas = await obtenerMovimientosDesdeInventario(req.headers.authorization, 'SALIDA');

    const totals = {};
    for (const movement of salidas) {
      const product = movement.producto;
      if (!product) continue;
      const id = product._id || product.id;
      if (!totals[id]) {
        totals[id] = { _id: id, nombre: product.nombre, totalVendido: 0, movimientos: 0 };
      }
      totals[id].totalVendido += movement.cantidad;
      totals[id].movimientos += 1;
    }

    const top = Object.values(totals)
      .sort((a, b) => b.totalVendido - a.totalVendido)
      .slice(0, limit);

    res.status(200).json({ success: true, total: top.length, data: top });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos más vendidos',
      error: error.message
    });
  }
};

export const getCategoriesReport = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const [productos, categorias] = await Promise.all([
      obtenerProductosDesdeInventario(token),
      obtenerCategoriasDesdeInventario(token)
    ]);

    const summary = categorias.map((category) => {
      const categoryProducts = productos.filter((p) => p.categoria === category.nombre);
      const totalStock = categoryProducts.reduce((sum, p) => sum + p.existencia, 0);
      const totalValue = categoryProducts.reduce((sum, p) => sum + p.existencia * p.precio, 0);

      return {
        _id: category._id,
        categoria: category.nombre,
        totalProductos: categoryProducts.length,
        totalExistencia: totalStock,
        valorTotal: Number(totalValue.toFixed(2))
      };
    });

    res.status(200).json({ success: true, total: summary.length, data: summary });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el resumen por categoría',
      error: error.message
    });
  }
};

export const getSummary = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const [productos, categorias, movimientos] = await Promise.all([
      obtenerProductosDesdeInventario(token),
      obtenerCategoriasDesdeInventario(token),
      obtenerMovimientosDesdeInventario(token)
    ]);

    const totalStock = productos.reduce((sum, p) => sum + p.existencia, 0);
    const inventoryValue = productos.reduce((sum, p) => sum + p.existencia * p.precio, 0);
    const lowStockCount = productos.filter((p) => p.existencia > 0 && p.existencia <= LOW_STOCK_LIMIT).length;
    const outOfStockCount = productos.filter((p) => p.existencia === 0).length;

    const entradas = movimientos.filter((m) => m.tipo === 'ENTRADA');
    const salidas = movimientos.filter((m) => m.tipo === 'SALIDA');

    res.status(200).json({
      success: true,
      data: {
        totalProductos: productos.length,
        totalCategorias: categorias.length,
        totalExistencia: totalStock,
        valorInventario: Number(inventoryValue.toFixed(2)),
        umbralBajoStock: LOW_STOCK_LIMIT,
        bajoStock: lowStockCount,
        agotados: outOfStockCount,
        movimientos: {
          total: movimientos.length,
          entradas: {
            count: entradas.length,
            unidades: entradas.reduce((sum, m) => sum + m.cantidad, 0)
          },
          salidas: {
            count: salidas.length,
            unidades: salidas.reduce((sum, m) => sum + m.cantidad, 0)
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el reporte general',
      error: error.message
    });
  }
};

export const getInventoryExcel = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const [productos, categorias, movimientos] = await Promise.all([
      obtenerProductosDesdeInventario(token),
      obtenerCategoriasDesdeInventario(token),
      obtenerMovimientosDesdeInventario(token)
    ]);

    const workbook = await buildInventoryExcel({
      productos,
      categorias,
      movimientos,
      threshold: LOW_STOCK_LIMIT
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_inventario.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el Excel',
      error: error.message
    });
  }
};
