import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SyncState from "@/models/SyncState";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        let state = await SyncState.findOne({
            key: "tms",
        }).lean();

        if (!state) {
            state = await SyncState.create({
                key: "tms",
                version: Date.now(),
            });
        }

        return NextResponse.json(
            {
                success: true,
                version: state.version,
            },
            {
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        console.error("Sync status error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در بررسی تغییرات",
            },
            {
                status: 500,
            }
        );
    }
}