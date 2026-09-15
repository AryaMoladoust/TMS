import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import { getUserFromSessionToken } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectToDatabase();

    const token = request.cookies.get("tms_session")?.value;

    const sessionData =
      await getUserFromSessionToken(token);

    if (!sessionData) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
        },
        { status: 401 }
      );
    }

    const { user } = sessionData;

    return NextResponse.json({
      success: true,
      authenticated: true,

      user: {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ME_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
      },
      { status: 500 }
    );
  }
}