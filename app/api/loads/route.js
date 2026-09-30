import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Load from "@/models/Load";
import { touchSyncState } from "@/lib/sync";

// =====================================
// گرفتن همه بارها
// =====================================

export async function GET() {
    try {
        await connectToDatabase();

        const loads = await Load.find().sort({
            createdAt: -1,
        });

        return NextResponse.json(loads);
    } catch (error) {
        console.error("GET /api/loads error:", error);

        return NextResponse.json(
            {
                message: "خطا در دریافت بارها",
            },
            {
                status: 500,
            }
        );
    }
}

// =====================================
// ساخت Load ID
// =====================================

async function generateLoadId() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const prefix = `LD-${year}${month}${day}`;

    const lastLoad = await Load.findOne({
        loadId: {
            $regex: `^${prefix}-`,
        },
    }).sort({
        loadId: -1,
    });

    let number = 1;

    if (lastLoad) {
        const lastNumber = parseInt(
            lastLoad.loadId.split("-")[2],
            10
        );

        if (!isNaN(lastNumber)) {
            number = lastNumber + 1;
        }
    }

    return `${prefix}-${String(number).padStart(4, "0")}`;
}

// =====================================
// ثبت بار جدید
// =====================================

export async function POST(request) {
    try {
        await connectToDatabase();

        const body = await request.json();

        // =================================
        // اطلاعات ضروری
        // =================================

        if (!body.title) {
            return NextResponse.json(
                {
                    message: "عنوان بار وارد نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!body.companyName) {
            return NextResponse.json(
                {
                    message: "شرکت انتخاب نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!body.barType) {
            return NextResponse.json(
                {
                    message: "نوع بار انتخاب نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        // =================================
        // مبدأ ثابت
        // =================================

        const originProvince =
            body.originProvince || "گیلان";

        const originCity =
            body.originCity || "رشت";

        // =================================
        // مقصد
        // =================================

        const destinationProvince =
            body.destinationProvince;

        const destinationCity =
            body.destinationCity;

        if (!destinationProvince) {
            return NextResponse.json(
                {
                    message: "استان مقصد انتخاب نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!destinationCity) {
            return NextResponse.json(
                {
                    message: "شهر مقصد انتخاب نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        // =================================
        // ساخت شناسه بار
        // =================================

        const loadId = await generateLoadId();

        // =================================
        // ساخت اطلاعات بار
        // =================================

        const load = await Load.create({
            loadId,

            title: body.title,

            barType: body.barType,

            companyName: body.companyName,

            // مبدأ استاندارد
            originProvince,

            originCity,

            // مقدار قدیمی برای سازگاری
            origin: originCity,

            // مقصد استاندارد
            destinationProvince,

            destinationCity,

            // مقدار قدیمی برای سازگاری
            destination: destinationCity,

            // مختصات مقصد
            destinationLat:
                body.destinationLocation?.lat ??
                body.destinationLat ??
                null,

            destinationLng:
                body.destinationLocation?.lng ??
                body.destinationLng ??
                null,

            distance:
                body.distance !== undefined
                    ? Number(body.distance)
                    : 0,

            address:
                body.address || "",

            price:
                body.price !== undefined
                    ? Number(body.price)
                    : 0,

            description:
                body.description || "",

            vehicleType:
                body.vehicleType || null,

            provinceStatus:
                body.provinceStatus || null,

            status:
                body.status || "pending",
        });

        // =================================
        // اعلام تغییر به تمام کلاینت‌ها
        // =================================

        await touchSyncState();

        // =================================
        // پاسخ موفق
        // =================================

        return NextResponse.json(
            load,
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST /api/loads error:",
            error
        );

        return NextResponse.json(
            {
                message: "ثبت بار ناموفق بود.",
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            {
                status: 500,
            }
        );
    }
}