import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";


// ==========================================
// GET
// دریافت لیست شرکت‌ها
// ==========================================

export async function GET() {
    try {
        await connectDB();

        const companies = await Company.find()
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            {
                success: true,
                companies,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "GET /api/companies error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت لیست شرکت‌ها",
            },
            {
                status: 500,
            }
        );
    }
}


// ==========================================
// POST
// ثبت شرکت جدید
// ==========================================

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            name,
            managerName,
            phone,
            landline,
            address,
            description,
        } = body;


        // ==================================
        // بررسی فیلدهای اجباری
        // ==================================

        if (
            !name?.trim() ||
            !managerName?.trim() ||
            !phone?.trim()
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "لطفاً نام شرکت، نام مسئول و شماره تماس را وارد کنید.",
                },
                {
                    status: 400,
                }
            );
        }


        // ==================================
        // بررسی شرکت تکراری
        // ==================================

        const existingCompany =
            await Company.findOne({
                name: name.trim(),
            });


        if (existingCompany) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "این شرکت قبلاً ثبت شده است.",
                },
                {
                    status: 409,
                }
            );
        }


        // ==================================
        // ایجاد شرکت
        // ==================================

        const company =
            await Company.create({
                name: name.trim(),

                managerName:
                    managerName.trim(),

                phone:
                    phone.trim(),

                landline:
                    landline?.trim() || "",

                address:
                    address?.trim() || "",

                description:
                    description?.trim() || "",
            });


        return NextResponse.json(
            {
                success: true,
                message:
                    "شرکت با موفقیت ثبت شد.",
                company,
            },
            {
                status: 201,
            }
        );

    } catch (error) {

        console.error(
            "POST /api/companies error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "خطا در ثبت شرکت.",
            },
            {
                status: 500,
            }
        );
    }
}