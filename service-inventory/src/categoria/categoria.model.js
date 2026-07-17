import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la categoría es requerido"],
      unique: true,
      trim: true,
      maxLength: [50, "El nombre no puede exceder 50 caracteres"]
    },
    descripcion: {
      type: String,
      trim: true,
      maxLength: [200, "La descripción no puede exceder 200 caracteres"],
      default: ""
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model("Category", categorySchema);
