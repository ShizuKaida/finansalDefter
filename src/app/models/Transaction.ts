// src/models/Transaction.ts
import { Schema, models, model, Types } from "mongoose";

const TransactionSchema = new Schema(
  {
    userId: { 
        type: Types.ObjectId,
        ref: "User", 
        required: true, 
         
    },
    income:   { 
        type: Boolean, 
        required: true, 
         
    },
    amount: { 
        type: Number, 
        required: true, 
        min: 0.01 
    },
    currency: { 
        type: String, 
        default: "TRY" 
    },
    categoryType: { 
        type: Number, 
        required: true, 
         
    }, // ✅ sayı
    note: { 
        type: String 
    },
    tags: [{ type: String }],
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

export default models.Transaction || model("Transaction", TransactionSchema);
