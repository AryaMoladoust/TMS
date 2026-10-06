import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";
import { touchSyncState } from "@/lib/sync";

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);

        const page = Math.max(
            Number(searchParams.get("page")) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 50,
                1
            ),
            100
        );

        const skip = (page - 1) * limit;

        const search = searchParams.get("search")?.trim();

        const filter = {};

        // جستجو روی کل دیتابیس
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { nationalId: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { vehiclePlate: { $regex: search, $options: "i" } },
                { licenseNumber: { $regex: search, $options: "i" } },
            ];
        }

        const [drivers, total] = await Promise.all([
            Driver.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Driver.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            drivers,

            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        });

    } catch (error) {
        console.error("GET /api/drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت لیست رانندگان",
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            name,
            nationalId,
            phone,
            landline,
            address,
            vehicleType,
            vehiclePlate,
            licenseNumber,
            licenseExpiry,
        } = body;

        if (
            !name ||
            !nationalId ||
            !phone ||
            !vehicleType ||
            !vehiclePlate ||
            !licenseNumber
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "لطفاً تمام فیلدهای الزامی را تکمیل کنید",
                },
                {
                    status: 400,
                }
            );
        }

        if (!/^\d{10}$/.test(nationalId)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "کد ملی باید ۱۰ رقم باشد",
                },
                {
                    status: 400,
                }
            );
        }

        const existingDriver =
            await Driver.findOne({
                nationalId,
            });

        if (existingDriver) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "راننده‌ای با این کد ملی قبلاً ثبت شده است",
                },
                {
                    status: 409,
                }
            );
        }

        const driver =
            await Driver.create({
                name,
                nationalId,
                phone,
                landline,
                address,
                vehicleType,
                vehiclePlate,
                licenseNumber,
                licenseExpiry,
                status: "available",
            });

        await touchSyncState();

        return NextResponse.json(
            {
                success: true,
                message:
                    "راننده با موفقیت ثبت شد",
                driver,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/drivers error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در ثبت راننده",
            },
            {
                status: 500,
            }
        );
    }
}