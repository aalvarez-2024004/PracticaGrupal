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
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      required: true
    },
    checkedBy: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

alertLogSchema.index({ productId: 1, type: 1, createdAt: -1 });

export default mongoose.model('AlertLog', alertLogSchema);
