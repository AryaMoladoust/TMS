import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import {
  getUserFromSessionToken,
  deleteUserSessions,
  createSession,
} from "@/lib/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const token =
      request.cookies.get("tms_session")?.value;

    const sessionData =
      await getUserFromSessionToken(token);

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          message: "ابتدا وارد سیستم شوید.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const confirmPassword = body.confirmPassword;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "تمام فیلدها را کامل کنید.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز جدید و تکرار آن یکسان نیستند.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز جدید باید حداقل ۴ کاراکتر باشد.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(
      sessionData.user._id
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "کاربر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    if (user.password !== currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور فعلی صحیح نیست.",
        },
        { status: 401 }
      );
    }

    user.password = newPassword;

    await user.save();

    /*
     * Sessionهای قبلی پاک می‌شوند.
     * سپس برای همین دستگاه یک Session جدید می‌سازیم.
     */

    await deleteUserSessions(user._id);

    const newSession = await createSession(user._id);

    const response = NextResponse.json({
      success: true,
      message: "رمز عبور با موفقیت تغییر کرد.",
    });

    response.cookies.set({
      name: "tms_session",
      value: newSession.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: newSession.expiresAt,
    });

    return response;
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی هنگام تغییر رمز عبور رخ داد.",
      },
      { status: 500 }
    );
  }
}