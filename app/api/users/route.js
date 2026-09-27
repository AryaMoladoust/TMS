import { NextResponse } from "next/server";

import User from "@/models/User";

import {
    getUserFromSessionToken,
    hashPassword,
} from "@/lib/auth";

import connectToDatabase from "@/lib/mongodb";


async function getCurrentUser(request) {
    const sessionToken =
        request.cookies.get("tms_session")?.value;

    if (!sessionToken) {
        return null;
    }

    const sessionData =
        await getUserFromSessionToken(
            sessionToken
        );

    if (!sessionData) {
        return null;
    }

    return sessionData.user;
}

/* =========================
   GET USERS
========================= */

export async function GET(request) {
    try {
        await connectToDatabase();

        const currentUser =
            await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "احراز هویت لازم است.",
                },
                { status: 401 }
            );
        }

        if (currentUser.role !== "owner") {
            return NextResponse.json(
                {
                    message:
                        "فقط مالک می‌تواند کاربران را مشاهده کند.",
                },
                { status: 403 }
            );
        }

        const users = await User.find({})
            .select("_id username role createdAt")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            users,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت کاربران.",
            },
            { status: 500 }
        );
    }
}


/* =========================
   ADD USER
========================= */

export async function POST(request) {
    try {
        await connectToDatabase();

        const currentUser =
            await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "احراز هویت لازم است.",
                },
                { status: 401 }
            );
        }

        if (currentUser.role !== "owner") {
            return NextResponse.json(
                {
                    message:
                        "فقط مالک می‌تواند کاربر اضافه کند.",
                },
                { status: 403 }
            );
        }

        const body = await request.json();

        const username =
            String(body.username || "").trim();

        if (!username) {
            return NextResponse.json(
                {
                    message:
                        "نام کاربری را وارد کنید.",
                },
                { status: 400 }
            );
        }

        const existingUser =
            await User.findOne({ username });

        if (existingUser) {
            return NextResponse.json(
                {
                    message:
                        "این نام کاربری قبلاً وجود دارد.",
                },
                { status: 409 }
            );
        }

        const passwordHash =
            await hashPassword("1234");

        const user = await User.create({
            username,
            password: passwordHash,
            role: "member",
        });

        return NextResponse.json(
            {
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                },
                message:
                    "کاربر با موفقیت اضافه شد. رمز اولیه: 1234",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در افزودن کاربر.",
            },
            { status: 500 }
        );
    }
}


/* =========================
   DELETE USER
========================= */

export async function DELETE(request) {
    try {
        await connectToDatabase();

        const currentUser =
            await getCurrentUser(request);

        if (!currentUser) {
            return NextResponse.json(
                {
                    message: "احراز هویت لازم است.",
                },
                { status: 401 }
            );
        }

        if (currentUser.role !== "owner") {
            return NextResponse.json(
                {
                    message:
                        "فقط مالک می‌تواند کاربر حذف کند.",
                },
                { status: 403 }
            );
        }

        const { searchParams } =
            new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    message:
                        "شناسه کاربر ارسال نشده است.",
                },
                { status: 400 }
            );
        }

        if (
            String(currentUser._id) ===
            String(id)
        ) {
            return NextResponse.json(
                {
                    message:
                        "نمی‌توانید خودتان را حذف کنید.",
                },
                { status: 400 }
            );
        }

        const user =
            await User.findById(id);

        if (!user) {
            return NextResponse.json(
                {
                    message: "کاربر پیدا نشد.",
                },
                { status: 404 }
            );
        }

        if (user.role === "owner") {
            return NextResponse.json(
                {
                    message:
                        "کاربر مالک قابل حذف نیست.",
                },
                { status: 403 }
            );
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message:
                "کاربر با موفقیت حذف شد.",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در حذف کاربر.",
            },
            { status: 500 }
        );
    }
}