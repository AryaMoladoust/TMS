import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

import {
    createSession,
    hashPassword,
    verifyPassword,
} from "@/lib/auth";

export async function POST(request) {
    try {
        await connectToDatabase();

        const body = await request.json();

        const username = body.username
            ?.trim()
            .toLowerCase();

        const password = body.password;

        if (!username || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نام کاربری و رمز عبور را وارد کنید.",
                },
                { status: 400 }
            );
        }

        let user =
            await User.findOne({ username });

        /*
        |--------------------------------------------------------------------------
        | اولین ورود سیستم
        |--------------------------------------------------------------------------
        |
        | اگر هیچ کاربری در MongoDB وجود نداشته باشد،
        | فقط admin / 1234 اجازه ایجاد مالک اولیه را دارد.
        |
        */

        if (!user) {
            const usersCount =
                await User.countDocuments();

            if (usersCount === 0) {
                if (
                    username !== "admin" ||
                    password !== "1234"
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "اطلاعات ورود اولیه صحیح نیست.",
                        },
                        { status: 401 }
                    );
                }

                const hashedPassword =
                    await hashPassword("1234");

                user = await User.create({
                    username: "admin",
                    password: hashedPassword,
                    role: "owner",
                });
            }
        }

        /*
        |--------------------------------------------------------------------------
        | کاربر پیدا نشد
        |--------------------------------------------------------------------------
        */

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نام کاربری یا رمز عبور اشتباه است.",
                },
                { status: 401 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | بررسی رمز
        |--------------------------------------------------------------------------
        */

        const passwordIsValid =
            await verifyPassword(
                password,
                user.password
            );

        if (!passwordIsValid) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نام کاربری یا رمز عبور اشتباه است.",
                },
                { status: 401 }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | ارتقای رمزهای قدیمی
        |--------------------------------------------------------------------------
        |
        | اگر کاربری قبل از این تغییر ساخته شده باشد
        | و رمز آن Plain Text باشد، بعد از Login
        | همان لحظه به Hash تبدیل می‌شود.
        |
        */

        if (
            !user.password.startsWith("scrypt$")
        ) {
            user.password =
                await hashPassword(password);

            await user.save();
        }

        /*
        |--------------------------------------------------------------------------
        | ساخت Session
        |--------------------------------------------------------------------------
        */

        const session =
            await createSession(user._id);

        const response =
            NextResponse.json({
                success: true,

                user: {
                    id: user._id.toString(),
                    username: user.username,
                    role: user.role,
                },
            });

        /*
        |--------------------------------------------------------------------------
        | Session Cookie
        |--------------------------------------------------------------------------
        */

        response.cookies.set({
            name: "tms_session",
            value: session.token,

            httpOnly: true,

            sameSite: "lax",

            secure:
                process.env.NODE_ENV ===
                "production",

            path: "/",

            expires: session.expiresAt,
        });

        return response;
    } catch (error) {
        console.error(
            "LOGIN_ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطایی هنگام ورود به سیستم رخ داد.",
            },
            { status: 500 }
        );
    }
}