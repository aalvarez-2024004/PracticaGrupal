import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },

        categoria: {
            type: String,
            required: true,
            trim: true
        },

        descripcion: {
            type: String,
            required: true,
            trim: true
        },

        precio: {
            type: Number,
            required: true,
            min: 0
        },

        existencia : {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export default mongoose.model("Product", productSchema) 