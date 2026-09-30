import SyncState from "@/models/SyncState";

export async function touchSyncState() {
    await SyncState.findOneAndUpdate(
        {
            key: "tms",
        },
        {
            $set: {
                version: Date.now(),
            },
        },
        {
            upsert: true,
            new: true,
        }
    );
}