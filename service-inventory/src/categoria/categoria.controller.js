import mongoose from "mongoose";
import Category from "./categoria.model.js";
import Product from "../product/product.model.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ nombre: 1 });
    res.status(200).json({
      success: true,
      total: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error: error.message
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre?.trim()) {
      return res.status(400).json({ success: false, message: "El nombre es requerido" });
    }

    const exists = await Category.findOne({ nombre: nombre.trim() });
    if (exists) {
      return res.status(400).json({ success: false, message: "La categoría ya existe" });
    }

    const category = await Category.create({
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || ""
    });

    res.status(201).json({
      success: true,
      message: "Categoría creada correctamente",
      category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al crear la categoría",
      error: error.message
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const current = await Category.findById(id);
    if (!current) {
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    const data = {};
    if (req.body.nombre) data.nombre = req.body.nombre.trim();
    if (req.body.descripcion !== undefined) data.descripcion = req.body.descripcion.trim();

    // Si cambia el nombre, actualizar productos que usaban el nombre anterior
    if (data.nombre && data.nombre !== current.nombre) {
      await Product.updateMany(
        { categoria: current.nombre },
        { $set: { categoria: data.nombre } }
      );
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "Categoría actualizada correctamente",
      category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al actualizar la categoría",
      error: error.message
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "ID inválido" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Categoría no encontrada" });
    }

    const inUse = await Product.countDocuments({ categoria: category.nombre });
    if (inUse > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar: hay ${inUse} producto(s) usando esta categoría`
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Categoría eliminada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la categoría",
      error: error.message
    });
  }
};
