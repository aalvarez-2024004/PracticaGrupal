import mongoose from "mongoose";
import Movement from "./movimiento.model.js";
import Product from "../product/product.model.js";

export const createEntry = async (req, res) => {
  try {
    const { producto: productId, cantidad, motivo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "ID de producto inválido" });
    }

    if (!cantidad || Number(cantidad) < 1) {
      return res.status(400).json({ success: false, message: "La cantidad debe ser al menos 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    const movement = await Movement.create({
      producto: productId,
      tipo: "ENTRADA",
      cantidad: Number(cantidad),
      motivo: motivo?.trim() || "",
      usuario: req.uid || null
    });

    product.existencia += Number(cantidad);
    await product.save();

    await movement.populate("producto", "nombre existencia");

    res.status(201).json({
      success: true,
      message: "Entrada registrada correctamente",
      movement,
      nuevaExistencia: product.existencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar la entrada",
      error: error.message
    });
  }
};

export const createOutput = async (req, res) => {
  try {
    const { producto: productId, cantidad, motivo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "ID de producto inválido" });
    }

    if (!cantidad || Number(cantidad) < 1) {
      return res.status(400).json({ success: false, message: "La cantidad debe ser al menos 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    if (product.existencia < Number(cantidad)) {
      return res.status(400).json({
        success: false,
        message: `Stock insuficiente. Disponible: ${product.existencia}, Solicitado: ${cantidad}`
      });
    }

    const movement = await Movement.create({
      producto: productId,
      tipo: "SALIDA",
      cantidad: Number(cantidad),
      motivo: motivo?.trim() || "",
      usuario: req.uid || null
    });

    product.existencia -= Number(cantidad);
    await product.save();

    await movement.populate("producto", "nombre existencia");

    res.status(201).json({
      success: true,
      message: "Salida registrada correctamente",
      movement,
      nuevaExistencia: product.existencia
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar la salida",
      error: error.message
    });
  }
};

export const getMovements = async (req, res) => {
  try {
    const { tipo, producto } = req.query;
    const filter = {};

    if (tipo) filter.tipo = tipo.toUpperCase();
    if (producto && mongoose.Types.ObjectId.isValid(producto)) filter.producto = producto;

    const movements = await Movement.find(filter)
      .populate("producto", "nombre")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: movements.length,
      movements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los movimientos",
      error: error.message
    });
  }
};
