import mongoose from "mongoose";

const LoadSchema = new mongoose.Schema(
    {
        loadId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        barType: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        origin: {
            type: String,
            required: true,
            trim: true,
        },

        destination: {
            type: String,
            required: true,
            trim: true,
        },

        destinationLat: {
            type: Number,
            default: null,
        },

        destinationLng: {
            type: Number,
            default: null,
        },

        distance: {
            type: Number,
            default: 0,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        price: {
            type: Number,
            default: 0,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        vehicleType: {
            type: String,
            enum: ["truck", "trailer", "pickup", "van"],
            default: null,
        },

        provinceStatus: {
            type: String,
            enum: ["inside", "outside"],
            default: null,
        },

        status: {
            type: String,
            enum: ["pending", "assigned", "delivered"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Load ||
    mongoose.model("Load", LoadSchema);