import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DailyDriver from "@/models/DailyDriver";
import Driver from "@/models/Driver";

function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const date = searchParams.get("date") || getTodayKey();

        const dailyDrivers = await DailyDriver.find({ date })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            date,
            dailyDrivers,
        });
    } catch (error) {
        console.error("GET /api/daily-drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت ورود روزانه رانندگان",
            },
            {
                status: 500,
            }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            driverId,
            name,
            phone,
            vehicleType,
            type,
            date,
        } = body;

        if (!type || !["main", "guest"].includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "نوع راننده نامعتبر است",
                },
                {
                    status: 400,
                }
            );
        }

        const entryDate = date || getTodayKey();

        // =========================
        // راننده اصلی
        // =========================

        if (type === "main") {
            if (!driverId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "راننده اصلی را انتخاب کنید",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const driver = await Driver.findById(driverId).lean();

            if (!driver) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "راننده موردنظر پیدا نشد",
                    },
                    {
                        status: 404,
                    }
                );
            }

            // جلوگیری از ثبت دوباره یک راننده در همان روز
            const existingDailyDriver = await DailyDriver.findOne({
                driverId,
                date: entryDate,
            });

            if (existingDailyDriver) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "این راننده امروز قبلاً ثبت شده است",
                    },
                    {
                        status: 409,
                    }
                );
            }

            // بررسی اعتبار گواهینامه
            if (!driver.licenseExpiry) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "تاریخ انقضای گواهینامه راننده ثبت نشده است",
                    },
                    {
                        status: 400,
                    }
                );
            }

            const dailyDriver = await DailyDriver.create({
                driverId: driver._id,
                name: driver.name,
                phone: driver.phone,
                vehicleType: driver.vehicleType,
                type: "main",
                date: entryDate,
                entryTime: getCurrentTime(),
            });

            return NextResponse.json(
                {
                    success: true,
                    message: "ورود راننده با موفقیت ثبت شد",
                    dailyDriver,
                },
                {
                    status: 201,
                }
            );
        }

        // =========================
        // راننده مهمان
        // =========================

        if (!name || !name.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "نام راننده مهمان را وارد کنید",
                },
                {
                    status: 400,
                }
            );
        }

        if (!vehicleType || !vehicleType.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "نوع خودرو را انتخاب کنید",
                },
                {
                    status: 400,
                }
            );
        }

        const dailyDriver = await DailyDriver.create({
            driverId: null,
            name: name.trim(),
            phone: phone?.trim() || "",
            vehicleType: vehicleType.trim(),
            type: "guest",
            date: entryDate,
            entryTime: getCurrentTime(),
        });

        return NextResponse.json(
            {
                success: true,
                message: "ورود راننده مهمان با موفقیت ثبت شد",
                dailyDriver,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST /api/daily-drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در ثبت ورود راننده",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شناسه ورود روزانه مشخص نشده است",
                },
                {
                    status: 400,
                }
            );
        }

        const deletedDriver = await DailyDriver.findByIdAndDelete(id);

        if (!deletedDriver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "رکورد موردنظر پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            message: "ورود روزانه راننده حذف شد",
        });
    } catch (error) {
        console.error("DELETE /api/daily-drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در حذف ورود روزانه راننده",
            },
            {
                status: 500,
            }
        );
    }
}