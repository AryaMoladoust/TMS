import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { deleteSession } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get("tms_session")?.value;

    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set({
      name: "tms_session",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("LOGOUT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا هنگام خروج از حساب.",
      },
      { status: 500 }
    );
  }
}