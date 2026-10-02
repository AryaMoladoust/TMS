import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";
import { touchSyncState } from "@/lib/sync";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        const companies = await Company.find({})
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            companies,
        });
    } catch (error) {
        console.error("GET /api/companies error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت شرکت‌ها.",
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
            managerName,
            phone,
            landline = "",
            address = "",
            description = "",
        } = body;

        if (
            !name?.trim() ||
            !managerName?.trim() ||
            !phone?.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "نام شرکت، نام مسئول و شماره تماس الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        const existingCompany = await Company.findOne({
            name: name.trim(),
        });

        if (existingCompany) {
            return NextResponse.json(
                {
                    success: false,
                    message: "این شرکت قبلاً ثبت شده است.",
                },
                {
                    status: 409,
                }
            );
        }

        const company = await Company.create({
            name: name.trim(),
            managerName: managerName.trim(),
            phone: phone.trim(),
            landline: landline?.trim() || "",
            address: address?.trim() || "",
            description: description?.trim() || "",
        });

        await touchSyncState();

        return NextResponse.json(
            {
                success: true,
                message: "شرکت با موفقیت ثبت شد.",
                company,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("POST /api/companies error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در ثبت شرکت.",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}