import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    nationalId: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    landline: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    vehicleType: {
      type: String,
      required: true,
      enum: ["truck", "trailer", "pickup", "van"],
    },

    vehiclePlate: {
      type: String,
      required: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },

    licenseExpiry: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "busy", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Driver ||
  mongoose.model("Driver", DriverSchema);