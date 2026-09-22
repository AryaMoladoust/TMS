import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const company = await Company.findById(id).lean();

        if (!company) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شرکت موردنظر پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                company,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "GET /api/companies/[id] error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت اطلاعات شرکت.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const body = await request.json();

        const {
            name,
            managerName,
            phone,
            landline,
            address,
            description,
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
                        "لطفاً نام شرکت، نام مسئول و شماره تماس را وارد کنید.",
                },
                {
                    status: 400,
                }
            );
        }

        const duplicateCompany =
            await Company.findOne({
                name: name.trim(),
                _id: { $ne: id },
            });

        if (duplicateCompany) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "شرکت دیگری با این نام قبلاً ثبت شده است.",
                },
                {
                    status: 409,
                }
            );
        }

        const company =
            await Company.findByIdAndUpdate(
                id,
                {
                    name: name.trim(),
                    managerName: managerName.trim(),
                    phone: phone.trim(),
                    landline: landline?.trim() || "",
                    address: address?.trim() || "",
                    description: description?.trim() || "",
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!company) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شرکت موردنظر پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "اطلاعات شرکت با موفقیت ویرایش شد.",
                company,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "PUT /api/companies/[id] error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "خطا در ویرایش شرکت.",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const company =
            await Company.findByIdAndDelete(id);

        if (!company) {
            return NextResponse.json(
                {
                    success: false,
                    message: "شرکت موردنظر پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "شرکت با موفقیت حذف شد.",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "DELETE /api/companies/[id] error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "خطا در حذف شرکت.",
            },
            {
                status: 500,
            }
        );
    }
}