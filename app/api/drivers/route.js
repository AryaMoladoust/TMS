import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";

export async function GET() {
    try {
        await connectDB();

        const drivers = await Driver.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            drivers,
        });
    } catch (error) {
        console.error("GET /api/drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت لیست رانندگان",
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
                    message: "لطفاً تمام فیلدهای الزامی را تکمیل کنید",
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
                    message: "کد ملی باید ۱۰ رقم باشد",
                },
                {
                    status: 400,
                }
            );
        }

        const existingDriver = await Driver.findOne({
            nationalId,
        });

        if (existingDriver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "راننده‌ای با این کد ملی قبلاً ثبت شده است",
                },
                {
                    status: 409,
                }
            );
        }

        const driver = await Driver.create({
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

        return NextResponse.json(
            {
                success: true,
                message: "راننده با موفقیت ثبت شد",
                driver,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST /api/drivers error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در ثبت راننده",
            },
            {
                status: 500,
            }
        );
    }
}