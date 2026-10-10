import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Driver from "@/models/Driver";

// ============================================================
// GET /api/drivers
//
// حالت عادی:
// /api/drivers?page=1&limit=50
//
// جستجو:
// /api/drivers?page=1&limit=50&search=محمد
//
// دریافت تمام رانندگان:
// /api/drivers?all=true
// ============================================================

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // --------------------------------------------------------
    // دریافت همه رانندگان
    // این حالت برای Dropdown انتخاب راننده استفاده می‌شود
    // --------------------------------------------------------

    const all = searchParams.get("all") === "true";

    if (all) {
      const drivers = await Driver.find({})
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        drivers,
      });
    }

    // --------------------------------------------------------
    // Pagination
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // Search
    // --------------------------------------------------------

    const search = searchParams.get("search")?.trim();

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          nationalId: {
            $regex: search,
            $options: "i",
          },
        },

        {
          phone: {
            $regex: search,
            $options: "i",
          },
        },

        {
          vehiclePlate: {
            $regex: search,
            $options: "i",
          },
        },

        {
          licenseNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // --------------------------------------------------------
    // دریافت رانندگان + تعداد کل
    // --------------------------------------------------------

    const [drivers, total] = await Promise.all([
      Driver.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Driver.countDocuments(filter),
    ]);

    // --------------------------------------------------------
    // تعداد صفحات
    // --------------------------------------------------------

    const totalPages = Math.ceil(total / limit);

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

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
        message: "خطا در دریافت رانندگان",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST /api/drivers
// ثبت راننده جدید
// ============================================================

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    // --------------------------------------------------------
    // اطلاعات ورودی
    // --------------------------------------------------------

    const {
      name,
      nationalId,
      phone,
      vehiclePlate,
      licenseNumber,
      vehicleType,
      address,
      description,
    } = body;

    // --------------------------------------------------------
    // بررسی فیلدهای ضروری
    // --------------------------------------------------------

    if (!name || !nationalId || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: "نام، کد ملی و شماره تماس الزامی هستند.",
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // بررسی تکراری نبودن کد ملی
    // --------------------------------------------------------

    const existingDriver = await Driver.findOne({
      nationalId,
    }).lean();

    if (existingDriver) {
      return NextResponse.json(
        {
          success: false,
          message: "راننده‌ای با این کد ملی قبلاً ثبت شده است.",
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------------------------------
    // ایجاد راننده
    // --------------------------------------------------------

    const driver = await Driver.create({
      name,
      nationalId,
      phone,
      vehiclePlate,
      licenseNumber,
      vehicleType,
      address,
      description,

      // وضعیت اولیه راننده
      status: "available",
    });

    // --------------------------------------------------------
    // اطلاع‌رسانی تغییر اطلاعات برای بخش‌های دیگر سیستم
    // --------------------------------------------------------

    try {
      await touchSyncState();
    } catch (syncError) {
      console.error(
        "touchSyncState error:",
        syncError
      );
    }

    // --------------------------------------------------------
    // Response
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: "راننده با موفقیت ثبت شد.",
        driver,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/drivers error:", error);

    // --------------------------------------------------------
    // Duplicate key
    // --------------------------------------------------------

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات راننده تکراری است.",
        },
        {
          status: 409,
        }
      );
    }

    // --------------------------------------------------------
    // Validation error
    // --------------------------------------------------------

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات وارد شده صحیح نیست.",
          errors: error.errors,
        },
        {
          status: 400,
        }
      );
    }

    // --------------------------------------------------------
    // سایر خطاها
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت راننده.",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}