import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import DailyDriver from "@/models/DailyDriver";
import Driver from "@/models/Driver";

/* =========================================================
   تاریخ امروز میلادی برای کلید دیتابیس
========================================================= */

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/* =========================================================
   ساعت فعلی
========================================================= */

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

/* =========================================================
   تبدیل اعداد فارسی به انگلیسی
========================================================= */

function normalizeDigits(value) {
    return String(value)
        .replace(/[۰-۹]/g, (digit) =>
            String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
        )
        .replace(/[٠-٩]/g, (digit) =>
            String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
        );
}

/* =========================================================
   تبدیل تاریخ شمسی به شماره روز
========================================================= */

function jalaliToDayNumber(year, month, day) {
    const epBase =
        year - (year >= 0 ? 474 : 473);

    const epYear =
        474 + (epBase % 2820);

    const monthDays =
        month <= 7
            ? 31 * (month - 1)
            : 30 * (month - 1) + 6;

    return (
        day +
        monthDays +
        Math.floor(
            (epYear * 682 - 110) / 2816
        ) +
        (epYear - 1) * 365 +
        Math.floor(epBase / 2820) * 1029983 +
        1948319
    );
}

/* =========================================================
   تاریخ شمسی امروز
========================================================= */

function getTodayJalali() {
    const now = new Date();

    const parts = new Intl.DateTimeFormat(
        "en-US-u-ca-persian",
        {
            timeZone: "Asia/Tehran",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }
    ).formatToParts(now);

    const year = Number(
        parts.find(
            (part) => part.type === "year"
        )?.value
    );

    const month = Number(
        parts.find(
            (part) => part.type === "month"
        )?.value
    );

    const day = Number(
        parts.find(
            (part) => part.type === "day"
        )?.value
    );

    return {
        year,
        month,
        day,
    };
}

/* =========================================================
   تبدیل تاریخ انقضا به تاریخ شمسی

   پشتیبانی از:
   1405/07/20
   ۱۴۰۵/۰۷/۲۰
   1405-07-20
   و Date / ISO
========================================================= */

function parseLicenseExpiry(value) {
    if (!value) {
        return null;
    }

    // اگر Date واقعی باشد
    if (value instanceof Date && !isNaN(value.getTime())) {
        const parts = new Intl.DateTimeFormat(
            "en-US-u-ca-persian",
            {
                timeZone: "Asia/Tehran",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            }
        ).formatToParts(value);

        return {
            year: Number(
                parts.find(
                    (part) =>
                        part.type === "year"
                )?.value
            ),
            month: Number(
                parts.find(
                    (part) =>
                        part.type === "month"
                )?.value
            ),
            day: Number(
                parts.find(
                    (part) =>
                        part.type === "day"
                )?.value
            ),
        };
    }

    let normalized = normalizeDigits(value)
        .trim()
        .replace(/\\/g, "/")
        .replace(/-/g, "/");

    /*
       اگر مقدار ISO مثل:
       2026-09-25T00:00:00.000Z
       باشد
    */
    if (
        normalized.includes("T") ||
        /^\d{4}-\d{2}-\d{2}/.test(
            String(value)
        )
    ) {
        const date = new Date(value);

        if (!isNaN(date.getTime())) {
            const parts =
                new Intl.DateTimeFormat(
                    "en-US-u-ca-persian",
                    {
                        timeZone: "Asia/Tehran",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }
                ).formatToParts(date);

            return {
                year: Number(
                    parts.find(
                        (part) =>
                            part.type === "year"
                    )?.value
                ),
                month: Number(
                    parts.find(
                        (part) =>
                            part.type === "month"
                    )?.value
                ),
                day: Number(
                    parts.find(
                        (part) =>
                            part.type === "day"
                    )?.value
                ),
            };
        }
    }

    const match = normalized.match(
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
    );

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    if (
        year < 1200 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return null;
    }

    return {
        year,
        month,
        day,
    };
}

/* =========================================================
   بررسی اعتبار گواهینامه

   بیشتر از ۳ روز → مجاز
   ۳ روز یا کمتر → غیرمجاز
========================================================= */

function checkLicenseExpiry(licenseExpiry) {
    const expiry =
        parseLicenseExpiry(
            licenseExpiry
        );

    if (!expiry) {
        return {
            allowed: false,
            message:
                "تاریخ انقضای گواهینامه این راننده ثبت نشده یا نامعتبر است.",
        };
    }

    const expiryNumber =
        jalaliToDayNumber(
            expiry.year,
            expiry.month,
            expiry.day
        );

    const today =
        getTodayJalali();

    const todayNumber =
        jalaliToDayNumber(
            today.year,
            today.month,
            today.day
        );

    const daysRemaining =
        expiryNumber - todayNumber;

    /* منقضی شده */
    if (daysRemaining < 0) {
        return {
            allowed: false,
            message:
                "امکان ثبت ورود وجود ندارد؛ گواهینامه راننده منقضی شده است.",
            daysRemaining,
        };
    }

    /* امروز */
    if (daysRemaining === 0) {
        return {
            allowed: false,
            message:
                "امکان ثبت ورود وجود ندارد؛ گواهینامه راننده امروز منقضی می‌شود.",
            daysRemaining,
        };
    }

    /* سه روز یا کمتر */
    if (daysRemaining <= 3) {
        return {
            allowed: false,
            message:
                `امکان ثبت ورود وجود ندارد؛ فقط ${daysRemaining} روز تا انقضای گواهینامه راننده باقی مانده است.`,
            daysRemaining,
        };
    }

    /* بیشتر از سه روز */
    return {
        allowed: true,
        daysRemaining,
    };
}

/* =========================================================
   GET
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

            /* =================================================
               بررسی گواهینامه راننده اصلی
            ================================================= */

            const licenseCheck =
                checkLicenseExpiry(
                    driver.licenseExpiry
                );

            if (!licenseCheck.allowed) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            licenseCheck.message,
                    },
                    {
                        status: 403,
                    }
                );
            }

            /* =================================================
               جلوگیری از ثبت تکراری
            ================================================= */

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
                        driver.vehicleType || "",

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

           هیچ بررسی گواهینامه ندارد
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
                error: error.message,
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

        const reset =
            searchParams.get("reset") === "true";

        const date =
            searchParams.get("date") ||
            getTodayKey();

        /* =====================================================
           ریست کل لیست همان روز
        ===================================================== */

        if (reset) {
            const result =
                await DailyDriver.deleteMany({
                    date,
                });

            return NextResponse.json({
                success: true,
                message:
                    "لیست ورود رانندگان امروز با موفقیت ریست شد.",
                deletedCount:
                    result.deletedCount,
            });
        }

        /* =====================================================
           حذف یک راننده از لیست روزانه
        ===================================================== */

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "شناسه ورود راننده مشخص نشده است.",
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
                "ورود راننده با موفقیت حذف شد.",
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
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}