import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { getUserFromSessionToken } from "@/lib/auth";

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

    /*
     * فقط Owner اجازه ساخت کاربر دارد.
     */

    if (sessionData.user.role !== "owner") {
      return NextResponse.json(
        {
          success: false,
          message: "شما اجازه افزودن کاربر ندارید.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const username = body.username?.trim().toLowerCase();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "نام کاربری و رمز عبور را وارد کنید.",
        },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        {
          success: false,
          message: "رمز عبور باید حداقل ۴ کاراکتر باشد.",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "این نام کاربری قبلاً ثبت شده است.",
        },
        { status: 409 }
      );
    }

    const user = await User.create({
      username,
      password,
      role: "member",
    });

    return NextResponse.json(
      {
        success: true,
        message: "کاربر با موفقیت ایجاد شد.",

        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_USER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی هنگام ایجاد کاربر رخ داد.",
      },
      { status: 500 }
    );
  }
}