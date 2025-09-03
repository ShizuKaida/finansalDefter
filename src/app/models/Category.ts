import { Schema, models, model, Types } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { 
        type: String,
        required: true
    },
    type: { 
        type: Number,//0=Yemek,1=Fatura,2=Ulaşım,3=Eğlence,4=Gelir... çeşitlendirilebilir
        required: true
    },
    income: {
      type: Boolean, // true: gelir, false: gider
      required: true
    },
    priority: { 
        type: Number,
        default: 0
    },
  }
);

export default models.Category || model("Category", CategorySchema);
