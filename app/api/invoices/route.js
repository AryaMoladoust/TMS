import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Driver from "@/models/Driver";
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
        console.error("GET invoices error:", error);

        return NextResponse.json(
            {
                message: "دریافت فاکتورها با خطا مواجه شد.",
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
            invoiceNumber,
            date,
            startTime,

            driverId,
            dailyDriverId,
            driverType,

            driverName,
            driverPhone,
            driverNationalId,
            driverLicenseNumber,

            vehicleId,
            vehicleType,
            vehiclePlate,

            loadId,
            loadType,

            companyId,
            companyName,

            origin,
            destination,
            distance,
            address,

            cost,
            costType,

            insuranceCost,
            workerCost,
            scaleCost,
            stopCost,
            commissionCost,

            description,
            receiverName,
            qrCode,
        } = body;

        /* =========================
           BASIC VALIDATION
        ========================= */

        if (!invoiceNumber?.trim()) {
            return NextResponse.json(
                {
                    message: "شماره فاکتور الزامی است.",
                },
                {
                    status: 400,
                }
            );
        }

        if (!date?.trim()) {
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

        /* =========================
           DUPLICATE INVOICE
        ========================= */

        const existingInvoice = await Invoice.findOne({
            invoiceNumber: invoiceNumber.trim(),
        });

        if (existingInvoice) {
            return NextResponse.json(
                {
                    message: "این شماره فاکتور قبلاً ثبت شده است.",
                },
                {
                    status: 409,
                }
            );
        }

        /* =========================
           DRIVER / DAILY DRIVER
        ========================= */

        let finalDriverId = null;
        let finalDailyDriverId = dailyDriverId || null;

        let finalDriverType =
            driverType === "guest" ? "guest" : "main";

        let finalDriverName =
            driverName?.trim() || "";

        let finalDriverPhone =
            driverPhone?.trim() || "";

        let finalDriverNationalId =
            driverNationalId?.trim() || "";

        let finalDriverLicenseNumber =
            driverLicenseNumber?.trim() || "";

        let finalVehicleId =
            vehicleId?.trim() || "";

        let finalVehicleType =
            vehicleType?.trim() || "";

        let finalVehiclePlate =
            vehiclePlate?.trim() || "";

        /*
         * اگر DailyDriver انتخاب شده باشد،
         * اطلاعات راننده از لیست ورود روزانه گرفته می‌شود.
         */

        if (dailyDriverId) {
            const dailyDriver =
                await DailyDriver.findById(
                    dailyDriverId
                ).lean();

            if (!dailyDriver) {
                return NextResponse.json(
                    {
                        message:
                            "راننده روزانه انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            if (dailyDriver.date !== getTodayKey()) {
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

            finalDriverName =
                dailyDriver.name || "";

            finalDriverPhone =
                dailyDriver.phone || "";

            finalVehicleType =
                dailyDriver.vehicleType || "";

            finalDriverType =
                dailyDriver.type === "guest"
                    ? "guest"
                    : "main";

            /*
             * راننده اصلی
             * اطلاعات کامل از Driver گرفته می‌شود.
             */

            if (
                dailyDriver.type === "main" &&
                dailyDriver.driverId
            ) {
                const driver =
                    await Driver.findById(
                        dailyDriver.driverId
                    ).lean();

                if (!driver) {
                    return NextResponse.json(
                        {
                            message:
                                "اطلاعات راننده اصلی پیدا نشد.",
                        },
                        {
                            status: 404,
                        }
                    );
                }

                finalDriverId =
                    driver._id;

                finalDriverName =
                    driver.name || finalDriverName;

                finalDriverPhone =
                    driver.phone || finalDriverPhone;

                finalDriverNationalId =
                    driver.nationalId || "";

                finalDriverLicenseNumber =
                    driver.licenseNumber || "";

                finalVehicleId =
                    driver._id?.toString() || "";

                finalVehicleType =
                    driver.vehicleType ||
                    finalVehicleType;

                finalVehiclePlate =
                    driver.vehiclePlate || "";
            } else {
                /*
                 * مهمان:
                 * driverId خالی می‌ماند.
                 * اطلاعاتی مثل پلاک و گواهینامه
                 * از مهمان دریافت نمی‌شود.
                 */

                finalDriverId = null;
                finalDriverNationalId = "";
                finalDriverLicenseNumber = "";
                finalVehicleId = "";
                finalVehiclePlate = "";
            }
        } else if (driverId) {
            /*
             * حالت انتخاب مستقیم راننده اصلی
             */

            const driver =
                await Driver.findById(
                    driverId
                ).lean();

            if (!driver) {
                return NextResponse.json(
                    {
                        message:
                            "راننده انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            finalDriverId =
                driver._id;

            finalDriverType = "main";

            finalDriverName =
                driver.name || "";

            finalDriverPhone =
                driver.phone || "";

            finalDriverNationalId =
                driver.nationalId || "";

            finalDriverLicenseNumber =
                driver.licenseNumber || "";

            finalVehicleId =
                driver._id?.toString() || "";

            finalVehicleType =
                driver.vehicleType ||
                finalVehicleType;

            finalVehiclePlate =
                driver.vehiclePlate || "";
        }

        /* =========================
           LOAD
        ========================= */

        let finalLoadId =
            loadId || null;

        let finalLoadType =
            loadType?.trim() || "";

        let finalCompanyName =
            companyName?.trim() || "";

        let finalOrigin =
            origin?.trim() || "";

        let finalDestination =
            destination?.trim() || "";

        let finalDistance =
            Number(distance) || 0;

        let finalAddress =
            address?.trim() || "";

        if (loadId) {
            const load =
                await Load.findById(
                    loadId
                ).lean();

            if (!load) {
                return NextResponse.json(
                    {
                        message:
                            "بار انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            finalLoadType =
                load.barType || "";

            finalCompanyName =
                load.companyName || "";

            finalOrigin =
                load.origin || "";

            finalDestination =
                load.destination || "";

            finalDistance =
                Number(load.distance) || 0;

            finalAddress =
                load.address || "";
        }

        /* =========================
           COMPANY
        ========================= */

        let finalCompanyId =
            companyId || null;

        if (companyId) {
            const company =
                await Company.findById(
                    companyId
                ).lean();

            if (!company) {
                return NextResponse.json(
                    {
                        message:
                            "شرکت انتخاب‌شده پیدا نشد.",
                    },
                    {
                        status: 404,
                    }
                );
            }

            finalCompanyName =
                company.name ||
                finalCompanyName;
        }

        /* =========================
           CREATE
        ========================= */

        const invoice =
            await Invoice.create({
                invoiceNumber:
                    invoiceNumber.trim(),

                date:
                    date.trim(),

                startTime:
                    startTime?.trim() || "",

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
                    finalLoadType,

                companyId:
                    finalCompanyId,

                companyName:
                    finalCompanyName,

                origin:
                    finalOrigin,

                destination:
                    finalDestination,

                distance:
                    finalDistance,

                address:
                    finalAddress,

                cost:
                    Number(cost) || 0,

                costType:
                    costType === "اعتباری"
                        ? "اعتباری"
                        : "نقد",

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

                description:
                    description?.trim() || "",

                receiverName:
                    receiverName?.trim() || "",

                qrCode:
                    qrCode?.trim() || "",
            });

        const result =
            await Invoice.findById(
                invoice._id
            )
                .populate("driverId")
                .populate("dailyDriverId")
                .populate("loadId")
                .populate("companyId")
                .lean();

        return NextResponse.json(
            result,
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(
            "POST invoice error:",
            error
        );

        if (error.code === 11000) {
            return NextResponse.json(
                {
                    message:
                        "این شماره فاکتور قبلاً ثبت شده است.",
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