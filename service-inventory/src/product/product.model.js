import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      maxLength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    categoria: {
      type: String,
      required: [true, "La categoría es requerida"],
      trim: true
    },
    descripcion: {
      type: String,
      trim: true,
      maxLength: [500, "La descripción no puede exceder 500 caracteres"],
      default: ""
    },
    precio: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio debe ser mayor o igual a 0"]
    },
    existencia: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "La existencia no puede ser negativa"]
    },
    usuario: {
      type: String,
      default: null
    },
    actualizadoPor: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

productSchema.index({ nombre: "text", descripcion: "text" });

export default mongoose.model("Product", productSchema);
