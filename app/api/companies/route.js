
import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";
import { touchSyncState } from "@/lib/sync";

export const dynamic = "force-dynamic";

// دریافت شرکت‌ها با جستجو و صفحه‌بندی
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(searchParams.get("limit")) || 50, 1),
      100
    );

    const search = searchParams.get("search")?.trim() || "";
    const skip = (page - 1) * limit;

    const filter = {};

    if (search) {
      const escapedSearch = search.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const regex = {
        $regex: escapedSearch,
        $options: "i",
      };

      filter.$or = [
        { name: regex },
        { managerName: regex },
        { phone: regex },
        { landline: regex },
      ];
    }

    const [companies, total, totalCompanies] =
      await Promise.all([
        Company.find(filter)
          .sort({ createdAt: -1, _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        // تعداد نتایج مطابق جستجو
        Company.countDocuments(filter),

        // تعداد کل شرکت‌ها، بدون اعمال فیلتر جستجو
        Company.countDocuments({}),
      ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      companies,

      // تعداد کل شرکت‌های ثبت‌شده
      totalCompanies,

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
    console.error("GET /api/companies error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت شرکت‌ها.",
      },
      { status: 500 }
    );
  }
}

// ثبت شرکت جدید
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
        { status: 400 }
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
        { status: 409 }
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
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/companies error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت شرکت.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}