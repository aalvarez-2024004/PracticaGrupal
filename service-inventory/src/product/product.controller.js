import mongoose from "mongoose";
import Product from "./product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { search, categoria } = req.query;
    const filter = {};

    if (search) {
      filter.nombre = { $regex: search, $options: "i" };
    }

    if (categoria) {
      filter.categoria = { $regex: categoria, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los productos",
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el producto",
      error: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, existencia } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({ success: false, message: "El nombre es requerido" });
    }
    if (!categoria?.trim()) {
      return res.status(400).json({ success: false, message: "La categoría es requerida" });
    }
    if (precio === undefined || Number(precio) < 0) {
      return res.status(400).json({ success: false, message: "El precio debe ser mayor o igual a 0" });
    }

    const product = new Product({
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      descripcion: descripcion?.trim() || "",
      precio: Number(precio),
      existencia: Number(existencia) || 0,
      usuario: req.uid || null
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Producto creado correctamente",
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear el producto",
      error: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const data = { ...req.body, actualizadoPor: req.uid || null };
    if (data.nombre) data.nombre = data.nombre.trim();
    if (data.categoria) data.categoria = data.categoria.trim();
    if (data.descripcion !== undefined) data.descripcion = data.descripcion.trim();

    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado correctamente",
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al actualizar el producto",
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el producto",
      error: error.message
    });
  }
};
