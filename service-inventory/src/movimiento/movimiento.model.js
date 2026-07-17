import mongoose from "mongoose";

const movementSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es requerido"]
    },
    tipo: {
      type: String,
      required: true,
      enum: {
        values: ["ENTRADA", "SALIDA"],
        message: "Tipo no válido. Debe ser: ENTRADA o SALIDA"
      }
    },
    cantidad: {
      type: Number,
      required: [true, "La cantidad es requerida"],
      min: [1, "La cantidad debe ser al menos 1"]
    },
    motivo: {
      type: String,
      trim: true,
      maxLength: [200, "El motivo no puede exceder 200 caracteres"],
      default: ""
    },
    usuario: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

movementSchema.index({ producto: 1, tipo: 1 });

export default mongoose.model("Movement", movementSchema);
