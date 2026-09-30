import mongoose from "mongoose";

const SyncStateSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },

        version: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
    }
);

export default
    mongoose.models.SyncState ||
    mongoose.model("SyncState", SyncStateSchema);