import { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    name: { type: String },
    currency: {
      type: String,
      default: "TRY"
    }
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
