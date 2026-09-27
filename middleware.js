import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // صفحه ورود آزاد است
    if (
        pathname === "/auth/login" ||
        pathname.startsWith("/auth/login/")
    ) {
        return NextResponse.next();
    }

    // API ها خودشان احراز هویت را انجام می‌دهند
    if (pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    // فایل‌های داخلی Next
    if (
        pathname.startsWith("/_next/") ||
        pathname === "/favicon.ico" ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // بررسی Session
    const sessionToken =
        request.cookies.get("tms_session")?.value;

    if (!sessionToken) {
        const loginUrl = new URL(
            "/auth/login",
            request.url
        );

        loginUrl.searchParams.set(
            "redirect",
            pathname
        );

        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image).*)",
    ],
};