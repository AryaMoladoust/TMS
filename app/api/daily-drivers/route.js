import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import DailyDriver from "@/models/DailyDriver";
import Driver from "@/models/Driver";

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

/* =========================================================
   GET
   ترتیب صف:
   قدیمی‌ترین ورود ← اول
   جدیدترین ورود ← آخر
========================================================= */

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } =
            new URL(request.url);

        const date =
            searchParams.get("date") ||
            getTodayKey();

        const dailyDrivers =
            await DailyDriver.find({
                date,
            })
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

/* =========================================================
   POST
========================================================= */

export async function POST(request) {
    try {
        await connectDB();

        const body =
            await request.json();

        const {
            driverId = null,
            name = "",
            phone = "",
            vehicleType = "",
            type,
            date = getTodayKey(),
        } = body;

        if (!type) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نوع راننده مشخص نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            type !== "main" &&
            type !== "guest"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نوع راننده نامعتبر است.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =====================================================
           راننده اصلی
        ===================================================== */

        if (type === "main") {
            if (!driverId) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "راننده را انتخاب کنید.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const driver =
                await Driver.findById(
                    driverId
                );

            if (!driver) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "راننده پیدا نشد.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            const alreadyExists =
                await DailyDriver.findOne({
                    driverId:
                        driver._id,
                    date,
                });

            if (alreadyExists) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "این راننده قبلاً برای امروز ثبت شده است.",
                    },
                    {
                        status: 409,
                    }
                );
            }

            const dailyDriver =
                await DailyDriver.create({
                    driverId:
                        driver._id,

                    name:
                        driver.name,

                    phone:
                        driver.phone || "",

                    vehicleType:
                        driver.vehicleType,

                    type: "main",

                    date,

                    entryTime:
                        getCurrentTime(),
                });

            const result =
                await DailyDriver.findById(
                    dailyDriver._id
                )
                    .populate("driverId")
                    .lean();

            return NextResponse.json(
                {
                    success: true,

                    message:
                        "ورود راننده با موفقیت ثبت شد.",

                    dailyDriver:
                        result,
                },
                {
                    status: 201,
                }
            );
        }

        /* =====================================================
           راننده مهمان
        ===================================================== */

        if (!name.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نام راننده مهمان الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!vehicleType.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نوع خودرو راننده مهمان الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        const dailyDriver =
            await DailyDriver.create({
                driverId: null,

                name:
                    name.trim(),

                phone:
                    phone?.trim() || "",

                vehicleType:
                    vehicleType.trim(),

                type: "guest",

                date,

                entryTime:
                    getCurrentTime(),
            });

        const result =
            await DailyDriver.findById(
                dailyDriver._id
            ).lean();

        return NextResponse.json(
            {
                success: true,

                message:
                    "راننده مهمان با موفقیت ثبت شد.",

                dailyDriver:
                    result,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "Create daily driver error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در ثبت ورود راننده",
                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } =
            new URL(request.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "شناسه راننده مشخص نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        const deleted =
            await DailyDriver.findByIdAndDelete(
                id
            );

        if (!deleted) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "ورودی راننده پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            message:
                "ورودی راننده با موفقیت حذف شد.",
        });
    } catch (error) {
        console.error(
            "Delete daily driver error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در حذف ورود راننده",
                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}