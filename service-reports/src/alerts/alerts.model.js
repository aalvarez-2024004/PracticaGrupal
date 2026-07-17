'use strict';
import mongoose from 'mongoose';

const alertLogSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['BAJO_STOCK', 'AGOTADO'],
            required: true
        },
        productId: {
            type: String, 
            required: true
        },
        productName: {
            type: String,
            required: true
        },
        category: {
            type: String
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        checkedBy: {
            type: String, 
            required: true
        }
    },
    {
        timestamps: true, 
        versionKey: false
    }
);

export default mongoose.model('AlertLog', alertLogSchema);