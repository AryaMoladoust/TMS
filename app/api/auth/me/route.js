import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { getUserFromSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        await connectDB();

        const token =
            request.cookies.get("tms_session")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "احراز هویت لازم است.",
                },
                {
                    status: 401,
                }
            );
        }

        const sessionData =
            await getUserFromSessionToken(token);

        if (
            !sessionData ||
            !sessionData.user
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "نشست کاربر معتبر نیست.",
                },
                {
                    status: 401,
                }
            );
        }

        const user = sessionData.user;

        return NextResponse.json({
            success: true,

            user: {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(
            "AUTH_ME_ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در بررسی وضعیت ورود کاربر.",
            },
            {
                status: 500,
            }
        );
    }
}