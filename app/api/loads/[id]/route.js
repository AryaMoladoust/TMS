import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Load from "@/models/Load";
import { touchSyncState } from "@/lib/sync";

// =====================================
// دریافت یک بار
// =====================================

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        const load = await Load.findById(id);

        if (!load) {
            return NextResponse.json(
                {
                    error: "بار پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(load);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "خطا در دریافت بار",
            },
            {
                status: 500,
            }
        );
    }
}

// =====================================
// ویرایش بار
// =====================================

export async function PUT(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        const body = await request.json();

        const load = await Load.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!load) {
            return NextResponse.json(
                {
                    error: "بار پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        // =====================================
        // اعلام تغییر به تمام کلاینت‌ها
        // =====================================

        await touchSyncState();

        return NextResponse.json(load);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "خطا در ویرایش بار",
            },
            {
                status: 500,
            }
        );
    }
}

// =====================================
// حذف بار
// =====================================

export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();

        const { id } = await params;

        const load = await Load.findByIdAndDelete(id);

        if (!load) {
            return NextResponse.json(
                {
                    error: "بار پیدا نشد",
                },
                {
                    status: 404,
                }
            );
        }

        // =====================================
        // اعلام تغییر به تمام کلاینت‌ها
        // =====================================

        await touchSyncState();

        return NextResponse.json({
            message: "بار با موفقیت حذف شد",
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "خطا در حذف بار",
            },
            {
                status: 500,
            }
        );
    }
}