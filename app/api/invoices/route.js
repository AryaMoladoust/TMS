import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

import Invoice from "@/models/Invoice";
import DailyDriver from "@/models/DailyDriver";
import Load from "@/models/Load";
import Company from "@/models/Company";

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

async function generateInvoiceNumber() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const datePrefix = `${year}${month}${day}`;
    const prefix = `INV-${datePrefix}-`;

    const lastInvoice = await Invoice.findOne({
        invoiceNumber: {
            $regex: `^${prefix}`,
        },
    })
        .sort({ invoiceNumber: -1 })
        .select("invoiceNumber")
        .lean();

    let nextNumber = 1;

    if (lastInvoice?.invoiceNumber) {
        const lastPart = lastInvoice.invoiceNumber.split("-").pop();
        const lastNumber = Number(lastPart);

        if (!Number.isNaN(lastNumber)) {
            nextNumber = lastNumber + 1;
        }
    }

    return `${prefix}${String(nextNumber).padStart(4, "0")}`;
}

export async function GET() {
    try {
        await connectDB();

        const invoices = await Invoice.find({})
            .populate("driverId")
            .populate("dailyDriverId")
            .populate("loadId")
            .populate("companyId")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(invoices);
    } catch (error) {
        console.error("Get invoices error:", error);

        return NextResponse.json(
            {
                message: "خطا در دریافت فاکتورها",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            invoiceNumber: requestedInvoiceNumber = "",
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

        // ==========================================
        // بررسی اطلاعات ضروری
        // ==========================================

        if (!date) {
            return NextResponse.json(
                {
                    message: "تاریخ فاکتور الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!driverName?.trim()) {
            return NextResponse.json(
                {
                    message: "نام راننده الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!vehicleType?.trim()) {
            return NextResponse.json(
                {
                    message: "نوع خودرو الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!loadType?.trim()) {
            return NextResponse.json(
                {
                    message: "نوع بار الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        // ==========================================
        // اطلاعات راننده
        // ==========================================

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
            driverLicenseNumber?.trim() || "";

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
                ).populate("driverId");

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

            // ======================================
            // راننده اصلی
            // ======================================

            if (
                dailyDriver.type === "main" &&
                dailyDriver.driverId
            ) {
                const realDriver =
                    dailyDriver.driverId;

                finalDriverId =
                    realDriver._id;

                finalDriverNationalId =
                    realDriver.nationalId || "";

                finalDriverLicenseNumber =
                    realDriver.licenseNumber || "";

                finalVehiclePlate =
                    realDriver.vehiclePlate || "";

                finalVehicleId =
                    String(realDriver._id);
            }

            // ======================================
            // راننده مهمان
            // ======================================

            if (
                dailyDriver.type === "guest"
            ) {
                finalDriverId = null;

                finalDriverNationalId =
                    "";

                finalDriverLicenseNumber =
                    "";

                finalVehicleId =
                    "";

                finalVehiclePlate =
                    "";
            }
        }

        if (!dailyDriverId) {
            finalDriverType = "manual";
            finalDailyDriverId = null;
        }

        // ==========================================
        // بررسی بار
        // ==========================================

        // ==========================================
// پیدا کردن بار
// ==========================================

let finalLoadId = null;

if (loadId) {
    let load = null;

    // اگر MongoDB ObjectId باشد
    if (
        typeof loadId === "string" &&
        /^[0-9a-fA-F]{24}$/.test(loadId)
    ) {
        load = await Load.findById(loadId);
    }

    // اگر شناسه داخلی بار باشد
    if (!load) {
        load = await Load.findOne({
            loadId: String(loadId),
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

    finalLoadId = load._id;
}

        // ==========================================
        // بررسی شرکت
        // ==========================================

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

        // ==========================================
        // شماره فاکتور
        // ==========================================

        const invoiceNumber =
            requestedInvoiceNumber?.trim() ||
            (await generateInvoiceNumber());

        // ==========================================
        // ساخت فاکتور
        // ==========================================

        const invoice =
            await Invoice.create({
                invoiceNumber,

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

                // ==================================
                // اطلاعات بار
                // ==================================

                loadId:
                    finalLoadId,

                loadType:
                    loadType?.trim() || "",

                companyId:
                    finalCompanyId,

                companyName:
                    companyName?.trim() || "",

                origin:
                    origin?.trim() || "",

                destination:
                    destination?.trim() || "",

                distance:
                    Number(distance) || 0,

                address:
                    address?.trim() || "",

                // ==================================
                // هزینه‌ها
                // ==================================

                cost:
                    Number(cost) || 0,

                costType,

                insuranceCost:
                    Number(insuranceCost) || 0,

                workerCost:
                    Number(workerCost) || 0,

                scaleCost:
                    Number(scaleCost) || 0,

                stopCost:
                    Number(stopCost) || 0,

                commissionCost:
                    Number(commissionCost) || 0,

                // ==================================
                // اطلاعات تکمیلی
                // ==================================

                description:
                    description?.trim() || "",

                receiverName:
                    receiverName?.trim() || "",

                qrCode:
                    qrCode?.trim() || "",
            });

        // ==========================================
        // حذف کامل بار بعد از ثبت موفق فاکتور
        // ==========================================

        if (finalLoadId) {
            try {
                const deletedLoad =
                    await Load.findByIdAndDelete(
                        finalLoadId
                    );

                if (!deletedLoad) {
                    // اگر بار پیدا نشد، فاکتور
                    // تازه ساخته‌شده را حذف می‌کنیم
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

                console.log(
                    "Load deleted after invoice:",
                    finalLoadId.toString()
                );
            } catch (deleteError) {
                console.error(
                    "Delete load after invoice error:",
                    deleteError
                );

                // ==================================
                // Rollback فاکتور
                // ==================================

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

        // ==========================================
        // پاسخ موفق
        // ==========================================

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

        // ==========================================
        // شماره فاکتور تکراری
        // ==========================================

        if (error.code === 11000) {
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