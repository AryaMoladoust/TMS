import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";
import mongoose from "mongoose";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شناسه راننده نامعتبر است",
                },
                { status: 400 }
            );
        }

        const driver = await Driver.findById(id).lean();

        if (!driver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "راننده پیدا نشد",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            driver,
        });
    } catch (error) {
        console.error("GET /api/drivers/[id] error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت اطلاعات راننده",
            },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شناسه راننده نامعتبر است",
                },
                { status: 400 }
            );
        }

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
            status,
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
                { status: 400 }
            );
        }

        if (!/^\d{10}$/.test(nationalId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "کد ملی باید ۱۰ رقم باشد",
                },
                { status: 400 }
            );
        }

        const duplicateDriver = await Driver.findOne({
            nationalId,
            _id: { $ne: id },
        });

        if (duplicateDriver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "راننده دیگری با این کد ملی ثبت شده است",
                },
                { status: 409 }
            );
        }

        const driver = await Driver.findByIdAndUpdate(
            id,
            {
                name,
                nationalId,
                phone,
                landline: landline || "",
                address: address || "",
                vehicleType,
                vehiclePlate,
                licenseNumber,
                licenseExpiry: licenseExpiry || "",
                status: status || "available",
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean();

        if (!driver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "راننده پیدا نشد",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "اطلاعات راننده با موفقیت ویرایش شد",
            driver,
        });
    } catch (error) {
        console.error("PUT /api/drivers/[id] error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در ویرایش راننده",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شناسه راننده نامعتبر است",
                },
                { status: 400 }
            );
        }

        const driver = await Driver.findByIdAndDelete(id);

        if (!driver) {
            return NextResponse.json(
                {
                    success: false,
                    message: "راننده پیدا نشد",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "راننده با موفقیت حذف شد",
        });
    } catch (error) {
        console.error("DELETE /api/drivers/[id] error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در حذف راننده",
            },
            { status: 500 }
        );
    }
}