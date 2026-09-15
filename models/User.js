import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "member"],
      default: "member",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);