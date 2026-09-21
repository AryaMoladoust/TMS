import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Load from "@/models/Load";

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


    // پیدا کردن آخرین بار همان روز

    const lastLoad = await Load.findOne({
        loadId: {
            $regex: `^${prefix}-`,
        },
    }).sort({
        loadId: -1,
    });


    let number = 1;


    if (lastLoad) {

        const lastNumber =
            parseInt(
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
        // بررسی اطلاعات ضروری
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


        if (!body.origin) {

            return NextResponse.json(
                {
                    message: "مبدأ وارد نشده است.",
                },
                {
                    status: 400,
                }
            );
        }


        if (!body.destination) {

            return NextResponse.json(
                {
                    message: "مقصد وارد نشده است.",
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

            origin: body.origin,

            destination: body.destination,


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