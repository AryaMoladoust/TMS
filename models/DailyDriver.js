import mongoose from "mongoose";

const DailyDriverSchema = new mongoose.Schema(
    {
        // اگر راننده اصلی باشد، شناسه Driver اینجا ذخیره می‌شود
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            default: "",
            trim: true,
        },

        vehicleType: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["main", "guest"],
            required: true,
        },

        // تاریخ روز ورود، به صورت YYYY-MM-DD
        date: {
            type: String,
            required: true,
            trim: true,
        },

        // ساعت ورود
        entryTime: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

DailyDriverSchema.index({ date: 1 });
DailyDriverSchema.index({ driverId: 1, date: 1 });

export default mongoose.models.DailyDriver ||
    mongoose.model("DailyDriver", DailyDriverSchema);