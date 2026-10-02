import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getUserFromSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        const dailyDrivers =
            await DailyDriver.find({})
                .populate("driverId")
                .sort({
                    createdAt: 1,
                })
                .lean();

        return NextResponse.json({
            success: true,
            dailyDrivers,
        });
    } catch (error) {
        console.error(
            "Get daily drivers error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در دریافت ورود روزانه رانندگان",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}