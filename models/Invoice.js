import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        date: {
            type: String,
            required: true,
            trim: true,
        },

        startTime: {
            type: String,
            default: "",
            trim: true,
        },

        /* =========================
           DRIVER
        ========================= */

        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null,
        },

        dailyDriverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DailyDriver",
            default: null,
        },

        driverType: {
            type: String,
            enum: ["main", "guest", "manual"],
            default: "main",
        },

        driverName: {
            type: String,
            required: true,
            trim: true,
        },

        driverPhone: {
            type: String,
            default: "",
            trim: true,
        },

        driverNationalId: {
            type: String,
            default: "",
            trim: true,
        },

        driverLicenseNumber: {
            type: String,
            default: "",
            trim: true,
        },

        vehicleId: {
            type: String,
            default: "",
            trim: true,
        },

        vehicleType: {
            type: String,
            required: true,
            trim: true,
        },

        vehiclePlate: {
            type: String,
            default: "",
            trim: true,
        },

        /* =========================
           LOAD
        ========================= */

        loadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Load",
            default: null,
        },

        loadType: {
            type: String,
            default: "",
            trim: true,
        },

        /* =========================
           COMPANY
        ========================= */

        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null,
        },

        companyName: {
            type: String,
            default: "",
            trim: true,
        },

        /* =========================
           ROUTE
        ========================= */

        origin: {
            type: String,
            default: "",
            trim: true,
        },

        destination: {
            type: String,
            default: "",
            trim: true,
        },

        distance: {
            type: Number,
            default: 0,
            min: 0,
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        /* =========================
           COSTS
        ========================= */

        cost: {
            type: Number,
            default: 0,
            min: 0,
        },

        costType: {
            type: String,
            enum: ["اعتباری", "نقد"],
            default: "نقد",
        },

        insuranceCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        workerCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        scaleCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        stopCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        commissionCost: {
            type: Number,
            default: 0,
            min: 0,
        },

        /* =========================
           OTHER
        ========================= */

        description: {
            type: String,
            default: "",
            trim: true,
        },

        receiverName: {
            type: String,
            default: "",
            trim: true,
        },

        qrCode: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Invoice ||
    mongoose.model("Invoice", InvoiceSchema);