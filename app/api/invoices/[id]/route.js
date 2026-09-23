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

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { id } = await params;

        const invoice =
            await Invoice.findById(id)
                .populate("driverId")
                .populate("dailyDriverId")
                .populate("loadId")
                .populate("companyId")
                .lean();

        if (!invoice) {
            return NextResponse.json(
                {
                    message: "فاکتور پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(invoice);
    } catch (error) {
        console.error(
            "GET invoice error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "دریافت فاکتور با خطا مواجه شد.",
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

        const invoice =
            await Invoice.findById(id);

        if (!invoice) {
            return NextResponse.json(
                {
                    message: "فاکتور پیدا نشد.",
                },
                {
                    status: 404,
                }
            );
        }

        const body =
            await request.json();

        /* =========================
           INVOICE NUMBER
        ========================= */

        if (
            body.invoiceNumber &&
            body.invoiceNumber !==
                invoice.invoiceNumber
        ) {
            const duplicate =
                await Invoice.findOne({
                    invoiceNumber:
                        body.invoiceNumber.trim(),
                    _id: {
                        $ne: id,
                    },
                });

            if (duplicate) {
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

            invoice.invoiceNumber =
                body.invoiceNumber.trim();
        }

        /* =========================
           DAILY DRIVER
        ========================= */

        if (
            Object.prototype.hasOwnProperty.call(
                body,
                "dailyDriverId"
            )
        ) {
            if (body.dailyDriverId) {
                const dailyDriver =
                    await DailyDriver.findById(
                        body.dailyDriverId
                    ).lean();

                if (!dailyDriver) {
                    return NextResponse.json(
                        {
                            message:
                                "راننده روزانه پیدا نشد.",
                        },
                        {
                            status: 404,
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

                invoice.dailyDriverId =
                    dailyDriver._id;

                invoice.driverType =
                    dailyDriver.type === "guest"
                        ? "guest"
                        : "main";

                invoice.driverName =
                    dailyDriver.name || "";

                invoice.driverPhone =
                    dailyDriver.phone || "";

                invoice.vehicleType =
                    dailyDriver.vehicleType || "";

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

                    invoice.driverId =
                        driver._id;

                    invoice.driverName =
                        driver.name || "";

                    invoice.driverPhone =
                        driver.phone || "";

                    invoice.driverNationalId =
                        driver.nationalId || "";

                    invoice.driverLicenseNumber =
                        driver.licenseNumber || "";

                    invoice.vehicleId =
                        driver._id?.toString() || "";

                    invoice.vehicleType =
                        driver.vehicleType || "";

                    invoice.vehiclePlate =
                        driver.vehiclePlate || "";
                } else {
                    invoice.driverId = null;

                    invoice.driverNationalId = "";
                    invoice.driverLicenseNumber = "";
                    invoice.vehicleId = "";
                    invoice.vehiclePlate = "";
                }
            } else {
                invoice.dailyDriverId = null;
            }
        }

        /* =========================
           DIRECT DRIVER
        ========================= */

        if (
            Object.prototype.hasOwnProperty.call(
                body,
                "driverId"
            )
        ) {
            if (body.driverId) {
                const driver =
                    await Driver.findById(
                        body.driverId
                    ).lean();

                if (!driver) {
                    return NextResponse.json(
                        {
                            message:
                                "راننده پیدا نشد.",
                        },
                        {
                            status: 404,
                        }
                    );
                }

                invoice.driverId =
                    driver._id;

                invoice.dailyDriverId =
                    body.dailyDriverId ||
                    null;

                invoice.driverType =
                    "main";

                invoice.driverName =
                    driver.name || "";

                invoice.driverPhone =
                    driver.phone || "";

                invoice.driverNationalId =
                    driver.nationalId || "";

                invoice.driverLicenseNumber =
                    driver.licenseNumber || "";

                invoice.vehicleId =
                    driver._id?.toString() || "";

                invoice.vehicleType =
                    driver.vehicleType || "";

                invoice.vehiclePlate =
                    driver.vehiclePlate || "";
            } else {
                invoice.driverId = null;

                invoice.dailyDriverId =
                    body.dailyDriverId ||
                    null;

                invoice.driverType =
                    body.driverType === "guest"
                        ? "guest"
                        : "main";

                invoice.driverName =
                    body.driverName?.trim() || "";

                invoice.driverPhone =
                    body.driverPhone?.trim() || "";

                invoice.driverNationalId =
                    body.driverNationalId?.trim() || "";

                invoice.driverLicenseNumber =
                    body.driverLicenseNumber?.trim() || "";

                invoice.vehicleId =
                    body.vehicleId?.trim() || "";

                invoice.vehicleType =
                    body.vehicleType?.trim() || "";

                invoice.vehiclePlate =
                    body.vehiclePlate?.trim() || "";
            }
        }

        /* =========================
           LOAD
        ========================= */

        if (
            Object.prototype.hasOwnProperty.call(
                body,
                "loadId"
            )
        ) {
            if (body.loadId) {
                const load =
                    await Load.findById(
                        body.loadId
                    ).lean();

                if (!load) {
                    return NextResponse.json(
                        {
                            message:
                                "بار پیدا نشد.",
                        },
                        {
                            status: 404,
                        }
                    );
                }

                invoice.loadId =
                    load._id;

                invoice.loadType =
                    load.barType || "";

                invoice.companyName =
                    load.companyName || "";

                invoice.origin =
                    load.origin || "";

                invoice.destination =
                    load.destination || "";

                invoice.distance =
                    Number(load.distance) || 0;

                invoice.address =
                    load.address || "";
            } else {
                invoice.loadId = null;

                invoice.loadType =
                    body.loadType?.trim() || "";

                invoice.companyName =
                    body.companyName?.trim() || "";

                invoice.origin =
                    body.origin?.trim() || "";

                invoice.destination =
                    body.destination?.trim() || "";

                invoice.distance =
                    Number(body.distance) || 0;

                invoice.address =
                    body.address?.trim() || "";
            }
        }

        /* =========================
           COMPANY
        ========================= */

        if (
            Object.prototype.hasOwnProperty.call(
                body,
                "companyId"
            )
        ) {
            if (body.companyId) {
                const company =
                    await Company.findById(
                        body.companyId
                    ).lean();

                if (!company) {
                    return NextResponse.json(
                        {
                            message:
                                "شرکت پیدا نشد.",
                        },
                        {
                            status: 404,
                        }
                    );
                }

                invoice.companyId =
                    company._id;

                invoice.companyName =
                    company.name ||
                    invoice.companyName;
            } else {
                invoice.companyId = null;

                if (
                    Object.prototype.hasOwnProperty.call(
                        body,
                        "companyName"
                    )
                ) {
                    invoice.companyName =
                        body.companyName?.trim() ||
                        "";
                }
            }
        }

        /* =========================
           GENERAL FIELDS
        ========================= */

        if (body.date !== undefined) {
            invoice.date =
                body.date?.trim() || "";
        }

        if (body.startTime !== undefined) {
            invoice.startTime =
                body.startTime?.trim() || "";
        }

        if (body.cost !== undefined) {
            invoice.cost =
                Number(body.cost) || 0;
        }

        if (body.costType !== undefined) {
            invoice.costType =
                body.costType === "اعتباری"
                    ? "اعتباری"
                    : "نقد";
        }

        if (
            body.insuranceCost !== undefined
        ) {
            invoice.insuranceCost =
                Number(body.insuranceCost) || 0;
        }

        if (
            body.workerCost !== undefined
        ) {
            invoice.workerCost =
                Number(body.workerCost) || 0;
        }

        if (
            body.scaleCost !== undefined
        ) {
            invoice.scaleCost =
                Number(body.scaleCost) || 0;
        }

        if (
            body.stopCost !== undefined
        ) {
            invoice.stopCost =
                Number(body.stopCost) || 0;
        }

        if (
            body.commissionCost !== undefined
        ) {
            invoice.commissionCost =
                Number(body.commissionCost) || 0;
        }

        if (
            body.description !== undefined
        ) {
            invoice.description =
                body.description?.trim() || "";
        }

        if (
            body.receiverName !== undefined
        ) {
            invoice.receiverName =
                body.receiverName?.trim() || "";
        }

        if (body.qrCode !== undefined) {
            invoice.qrCode =
                body.qrCode?.trim() || "";
        }

        await invoice.save();

        const result =
            await Invoice.findById(id)
                .populate("driverId")
                .populate("dailyDriverId")
                .populate("loadId")
                .populate("companyId")
                .lean();

        return NextResponse.json(result);
    } catch (error) {
        console.error(
            "PUT invoice error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "ویرایش فاکتور با خطا مواجه شد.",
                error:
                    error.message,
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    request,
    { params }
) {
    try {
        await connectDB();

        const { id } = await params;

        const deleted =
            await Invoice.findByIdAndDelete(id);

        if (!deleted) {
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

        return NextResponse.json({
            message:
                "فاکتور با موفقیت حذف شد.",
        });
    } catch (error) {
        console.error(
            "DELETE invoice error:",
            error
        );

        return NextResponse.json(
            {
                message:
                    "حذف فاکتور با خطا مواجه شد.",
            },
            {
                status: 500,
            }
        );
    }
}