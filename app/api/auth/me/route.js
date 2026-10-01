import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getUserFromSessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        await connectDB();

        const sessionToken =
            request.cookies.get("tms_session")?.value;

        if (!sessionToken) {
            return NextResponse.json(
                {
                    success: false,
                    user: null,
                    message: "کاربر وارد نشده است.",
                },
                {
                    status: 401,
                }
            );
        }

        const result =
            await getUserFromSessionToken(sessionToken);

        if (!result || !result.user) {
            return NextResponse.json(
                {
                    success: false,
                    user: null,
                    message: "جلسه کاربر معتبر نیست.",
                },
                {
                    status: 401,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user: {
                    id: result.user._id,
                    username: result.user.username,
                    name: result.user.name,
                    role: result.user.role,
                },
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "no-store, no-cache, must-revalidate",
                },
            }
        );
    } catch (error) {
        console.error("AUTH_ME_ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                user: null,
                message: "خطا در بررسی ورود کاربر.",
            },
            {
                status: 500,
            }
        );
    }
}