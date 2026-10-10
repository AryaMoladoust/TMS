import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Invoice from "@/models/Invoice";
import DailyDriver from "@/models/DailyDriver";
import Load from "@/models/Load";
import Company from "@/models/Company";

import { getUserFromSessionToken } from "@/lib/auth";
import { touchSyncState } from "@/lib/sync";

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function generateInvoiceNumber() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        today.getDate()
    ).padStart(2, "0");

    const datePrefix =
        `${year}${month}${day}`;

    const prefix =
        `INV-${datePrefix}-`;

    const lastInvoice =
        await Invoice.findOne({
            invoiceNumber: {
                $regex: `^${prefix}`,
            },
        })
            .sort({
                invoiceNumber: -1,
            })
            .select("invoiceNumber")
            .lean();

    let nextNumber = 1;

    if (lastInvoice?.invoiceNumber) {
        const lastPart =
            lastInvoice.invoiceNumber
                .split("-")
                .pop();

        const lastNumber =
            Number(lastPart);

        if (!Number.isNaN(lastNumber)) {
            nextNumber =
                lastNumber + 1;
        }
    }

    return `${prefix}${String(
        nextNumber
    ).padStart(4, "0")}`;
}

/* ======================================================
   GET - دریافت فاکتورها با Pagination
====================================================== */

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } =
            new URL(request.url);

        /* =========================
           Pagination
        ========================= */

        const page = Math.max(
            Number(
                searchParams.get("page")
            ) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number(
                    searchParams.get("limit")
                ) || 50,
                1
            ),
            100
        );

        const skip =
            (page - 1) * limit;

        /* =========================
           Filters
        ========================= */

        const search =
            searchParams
                .get("search")
                ?.trim() || "";

        const company =
            searchParams
                .get("company")
                ?.trim() || "";

        const driver =
            searchParams
                .get("driver")
                ?.trim() || "";

        const date =
            searchParams
                .get("date")
                ?.trim() || "";

        /* =========================
           MongoDB Filter
        ========================= */

        const filter = {};

        /*
         * جستجو در کل دیتابیس
         */
        if (search) {
            filter.$or = [
                {
                    invoiceNumber: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    driverName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    companyName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    createdByUserName: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    origin: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    destination: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    driverPhone: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        /* =========================
           شرکت
        ========================= */

        if (company) {
            filter.companyName =
                company;
        }

        /* =========================
           راننده
        ========================= */

        if (driver) {
            filter.driverName =
                driver;
        }

        /* =========================
           تاریخ
        ========================= */

        if (date) {
            filter.date = date;
        }

        /* =========================
           دریافت اطلاعات
        ========================= */

        const [
            invoices,
            total,
            allCompanies,
            allDrivers,
        ] = await Promise.all([
            Invoice.find(filter)
                .populate("driverId")
                .populate("dailyDriverId")
                .populate("loadId")
                .populate("companyId")
                .populate(
                    "createdByUserId",
                    "username"
                )
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            Invoice.countDocuments(
                filter
            ),

            /*
             * برای dropdown شرکت‌ها
             * از کل دیتابیس می‌گیریم
             */
            Invoice.distinct(
                "companyName"
            ),

            /*
             * برای dropdown راننده‌ها
             * از کل دیتابیس می‌گیریم
             */
            Invoice.distinct(
                "driverName"
            ),
        ]);

        /* =========================
           Pagination Info
        ========================= */

        const totalPages =
            Math.ceil(
                total / limit
            );

        return NextResponse.json({
            success: true,

            invoices,

            pagination: {
                page,
                limit,
                total,
                totalPages,

                hasNextPage:
                    page < totalPages,

                hasPreviousPage:
                    page > 1,
            },

            filterOptions: {
                companies:
                    allCompanies
                        .filter(Boolean)
                        .sort(),

                drivers:
                    allDrivers
                        .filter(Boolean)
                        .sort(),
            },
        });

    } catch (error) {
        console.error(
            "Get invoices error:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "خطا در دریافت فاکتورها",

                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}

/* ======================================================
   DELETE - حذف فاکتور
====================================================== */

export async function DELETE(
    request
) {
    try {
        await connectDB();

        const { searchParams } =
            new URL(request.url);

        const id =
            searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                {
                    message:
                        "شناسه فاکتور ارسال نشده است.",
                },
                {
                    status: 400,
                }
            );
        }

        const invoice =
            await Invoice.findById(id);

        if (!invoice) {
            return NextResponse.json(
                {
                    message:
                        "فاکتور پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        await Invoice.findByIdAndDelete(
            id
        );

        await touchSyncState();

        return NextResponse.json(
            {
                message:
                    "فاکتور با موفقیت حذف شد.",

                deletedId: id,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "Delete invoice error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "حذف فاکتور با خطا مواجه شد.",

                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}

/* ======================================================
   POST - ثبت فاکتور جدید
====================================================== */

export async function POST(
    request
) {
    try {
        await connectDB();

        const body =
            await request.json();

        /* =========================
           User
        ========================= */

        const sessionToken =
            request.cookies
                .get("tms_session")
                ?.value;

        const sessionData =
            await getUserFromSessionToken(
                sessionToken
            );

        if (!sessionData) {
            return NextResponse.json(
                {
                    message:
                        "جلسه کاربری معتبر نیست. دوباره وارد سیستم شوید.",
                },
                {
                    status: 401,
                }
            );
        }

        const currentUser =
            sessionData.user;

        const createdByUserId =
            currentUser._id;

        const createdByUserName =
            currentUser.username;

        /* =========================
           Body
        ========================= */

        const {
            invoiceNumber:
                requestedInvoiceNumber = "",

            date,

            startTime = "",

            dailyDriverId = null,

            driverId = null,

            driverType = "main",

            driverName = "",

            driverPhone = "",

            driverNationalId = "",

            driverLicenseNumber = "",

            vehicleId = "",

            vehicleType = "",

            vehiclePlate = "",

            loadId = null,

            loadType = "",

            companyId = null,

            companyName = "",

            origin = "",

            destination = "",

            distance = 0,

            address = "",

            cost = 0,

            costType = "نقد",

            insuranceCost = 0,

            workerCost = 0,

            scaleCost = 0,

            stopCost = 0,

            commissionCost = 0,

            description = "",

            receiverName = "",

            qrCode = "",
        } = body;

        /* =========================
           Required Fields
        ========================= */

        if (!date) {
            return NextResponse.json(
                {
                    message:
                        "تاریخ فاکتور الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!driverName?.trim()) {
            return NextResponse.json(
                {
                    message:
                        "نام راننده الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!vehicleType?.trim()) {
            return NextResponse.json(
                {
                    message:
                        "نوع خودرو الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!loadType?.trim()) {
            return NextResponse.json(
                {
                    message:
                        "نوع بار الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        /* =========================
           Driver
        ========================= */

        let finalDailyDriverId =
            dailyDriverId || null;

        let finalDriverId =
            driverId || null;

        let finalDriverType =
            driverType || "manual";

        let finalDriverName =
            driverName.trim();

        let finalDriverPhone =
            driverPhone?.trim() || "";

        let finalDriverNationalId =
            driverNationalId?.trim() || "";

        let finalDriverLicenseNumber =
            driverLicenseNumber?.trim() ||
            "";

        let finalVehicleId =
            vehicleId?.trim() || "";

        let finalVehicleType =
            vehicleType.trim();

        let finalVehiclePlate =
            vehiclePlate?.trim() || "";

        if (dailyDriverId) {
            const dailyDriver =
                await DailyDriver.findById(
                    dailyDriverId
                ).populate(
                    "driverId"
                );

            if (!dailyDriver) {
                return NextResponse.json(
                    {
                        message:
                            "راننده ورود روزانه پیدا نشد.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            if (
                dailyDriver.date !==
                getTodayKey()
            ) {
                return NextResponse.json(
                    {
                        message:
                            "فقط رانندگان ورود روزانه امروز قابل استفاده هستند.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            finalDailyDriverId =
                dailyDriver._id;

            finalDriverType =
                dailyDriver.type;

            finalDriverName =
                dailyDriver.name;

            finalDriverPhone =
                dailyDriver.phone || "";

            finalVehicleType =
                dailyDriver.vehicleType;

            if (
                dailyDriver.type ===
                    "main" &&
                dailyDriver.driverId
            ) {
                const realDriver =
                    dailyDriver.driverId;

                finalDriverId =
                    realDriver._id;

                finalDriverNationalId =
                    realDriver.nationalId ||
                    "";

                finalDriverLicenseNumber =
                    realDriver.licenseNumber ||
                    "";

                finalVehiclePlate =
                    realDriver.vehiclePlate ||
                    "";

                finalVehicleId =
                    String(
                        realDriver._id
                    );
            }

            if (
                dailyDriver.type ===
                "guest"
            ) {
                finalDriverId = null;

                finalDriverNationalId =
                    "";

                finalDriverLicenseNumber =
                    "";

                finalVehicleId = "";

                finalVehiclePlate = "";
            }
        }

        if (!dailyDriverId) {
            finalDriverType =
                "manual";

            finalDailyDriverId =
                null;
        }

        /* =========================
           Load
        ========================= */

        let finalLoadId = null;

        if (loadId) {
            let load = null;

            if (
                typeof loadId ===
                    "string" &&
                /^[0-9a-fA-F]{24}$/.test(
                    loadId
                )
            ) {
                load =
                    await Load.findById(
                        loadId
                    );
            }

            if (!load) {
                load =
                    await Load.findOne({
                        loadId: String(
                            loadId
                        ),
                    });
            }

            if (!load) {
                return NextResponse.json(
                    {
                        message:
                            "بار انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            finalLoadId =
                load._id;
        }

        /* =========================
           Company
        ========================= */

        let finalCompanyId =
            companyId || null;

        if (companyId) {
            const company =
                await Company.findById(
                    companyId
                );

            if (!company) {
                return NextResponse.json(
                    {
                        message:
                            "شرکت انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 400,
                    }
                );
            }

            finalCompanyId =
                company._id;
        }

        /* =========================
           Invoice Number
        ========================= */

        const invoiceNumber =
            requestedInvoiceNumber?.trim() ||
            (await generateInvoiceNumber());

        /* =========================
           Create Invoice
        ========================= */

        const invoice =
            await Invoice.create({
                invoiceNumber,

                createdByUserId,

                createdByUserName,

                date,

                startTime,

                driverId:
                    finalDriverId,

                dailyDriverId:
                    finalDailyDriverId,

                driverType:
                    finalDriverType,

                driverName:
                    finalDriverName,

                driverPhone:
                    finalDriverPhone,

                driverNationalId:
                    finalDriverNationalId,

                driverLicenseNumber:
                    finalDriverLicenseNumber,

                vehicleId:
                    finalVehicleId,

                vehicleType:
                    finalVehicleType,

                vehiclePlate:
                    finalVehiclePlate,

                loadId:
                    finalLoadId,

                loadType:
                    loadType?.trim() ||
                    "",

                companyId:
                    finalCompanyId,

                companyName:
                    companyName?.trim() ||
                    "",

                origin:
                    origin?.trim() || "",

                destination:
                    destination?.trim() ||
                    "",

                distance:
                    Number(distance) || 0,

                address:
                    address?.trim() || "",

                cost:
                    Number(cost) || 0,

                costType,

                insuranceCost:
                    Number(
                        insuranceCost
                    ) || 0,

                workerCost:
                    Number(
                        workerCost
                    ) || 0,

                scaleCost:
                    Number(
                        scaleCost
                    ) || 0,

                stopCost:
                    Number(
                        stopCost
                    ) || 0,

                commissionCost:
                    Number(
                        commissionCost
                    ) || 0,

                description:
                    description?.trim() ||
                    "",

                receiverName:
                    receiverName?.trim() ||
                    "",

                qrCode:
                    qrCode?.trim() || "",
            });

        /* =========================
           Delete Load
        ========================= */

        let deletedLoadSnapshot =
            null;

        if (finalLoadId) {
            try {
                const deletedLoad =
                    await Load.findByIdAndDelete(
                        finalLoadId
                    );

                if (!deletedLoad) {
                    await Invoice.findByIdAndDelete(
                        invoice._id
                    );

                    return NextResponse.json(
                        {
                            message:
                                "فاکتور ثبت شد اما بار حذف نشد؛ عملیات برگشت داده شد.",
                        },
                        {
                            status: 409,
                        }
                    );
                }

                deletedLoadSnapshot =
                    deletedLoad.toObject();

            } catch (
                deleteError
            ) {
                console.error(
                    "Delete load after invoice error:",
                    deleteError
                );

                await Invoice.findByIdAndDelete(
                    invoice._id
                );

                return NextResponse.json(
                    {
                        message:
                            "حذف بار انجام نشد و ثبت فاکتور نیز برگشت داده شد.",

                        error:
                            deleteError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }
        }

        /* =========================
           Delete Daily Driver
        ========================= */

        if (finalDailyDriverId) {
            try {
                const deletedDailyDriver =
                    await DailyDriver.findByIdAndDelete(
                        finalDailyDriverId
                    );

                if (!deletedDailyDriver) {
                    await Invoice.findByIdAndDelete(
                        invoice._id
                    );

                    if (
                        deletedLoadSnapshot
                    ) {
                        await Load.create(
                            deletedLoadSnapshot
                        );
                    }

                    return NextResponse.json(
                        {
                            message:
                                "فاکتور ثبت شد اما راننده از لیست روزانه حذف نشد؛ عملیات برگشت داده شد.",
                        },
                        {
                            status: 409,
                        }
                    );
                }

            } catch (
                dailyDriverError
            ) {
                console.error(
                    "Delete daily driver after invoice error:",
                    dailyDriverError
                );

                await Invoice.findByIdAndDelete(
                    invoice._id
                );

                if (
                    deletedLoadSnapshot
                ) {
                    try {
                        await Load.create(
                            deletedLoadSnapshot
                        );
                    } catch (
                        restoreLoadError
                    ) {
                        console.error(
                            "Restore load error:",
                            restoreLoadError
                        );
                    }
                }

                return NextResponse.json(
                    {
                        message:
                            "راننده از لیست روزانه حذف نشد؛ عملیات برگشت داده شد.",

                        error:
                            dailyDriverError.message,
                    },
                    {
                        status: 500,
                    }
                );
            }
        }

        /* =========================
           Sync
        ========================= */

        await touchSyncState();

        return NextResponse.json(
            {
                message:
                    "فاکتور با موفقیت ثبت شد و بار از لیست بارها حذف شد.",

                invoiceNumber:
                    invoice.invoiceNumber,

                invoice,
            },
            {
                status: 201,
            }
        );

    } catch (error) {
        console.error(
            "Create invoice error:",
            error
        );

        if (
            error.code ===
            11000
        ) {
            return NextResponse.json(
                {
                    message:
                        "شماره فاکتور تکراری شد. دوباره تلاش کنید.",
                },
                {
                    status: 409,
                }
            );
        }

        return NextResponse.json(
            {
                message:
                    "ثبت فاکتور با خطا مواجه شد.",

                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}