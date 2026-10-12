import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import Driver from "@/models/Driver";
import Company from "@/models/Company";
import Load from "@/models/Load";

export const dynamic = "force-dynamic";

/* ======================================================
   Helpers
====================================================== */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const AR_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// یکسان‌سازی متن فارسی (ی/ک عربی، نیم‌فاصله، فاصله اضافه)
function normJs(value) {
    return String(value ?? "")
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, " ")
        .trim();
}

// همان یکسان‌سازی بالا، اما داخل MongoDB
function normExpr(expr) {
    return {
        $trim: {
            input: {
                $replaceAll: {
                    input: {
                        $replaceAll: {
                            input: {
                                $replaceAll: {
                                    input: {
                                        $toString: {
                                            $ifNull: [expr, ""],
                                        },
                                    },
                                    find: "ي",
                                    replacement: "ی",
                                },
                            },
                            find: "ك",
                            replacement: "ک",
                        },
                    },
                    find: "\u200c",
                    replacement: " ",
                },
            },
        },
    };
}

// کلید یکتا برای راننده / شرکت:
// ابتدا نام (یکسان‌شده)، اگر نام نبود شناسه
function keyExpr(nameField, idField) {
    return {
        $cond: [
            { $ne: [normExpr(nameField), ""] },
            { $concat: ["name:", normExpr(nameField)] },
            {
                $cond: [
                    { $eq: [{ $ifNull: [idField, null] }, null] },
                    "",
                    { $concat: ["id:", { $toString: idField }] },
                ],
            },
        ],
    };
}

// تبدیل تاریخ رشته‌ای (۱۴۰۵/۰۷/۲۰ یا 1405-07-20) به عدد 14050720
function dateNumExpr() {
    const asciiDate = {
        $reduce: {
            input: { $range: [0, 10] },
            initialValue: {
                $replaceAll: {
                    input: { $toString: { $ifNull: ["$date", ""] } },
                    find: "-",
                    replacement: "/",
                },
            },
            in: {
                $replaceAll: {
                    input: {
                        $replaceAll: {
                            input: "$$value",
                            find: { $arrayElemAt: [FA_DIGITS, "$$this"] },
                            replacement: { $toString: "$$this" },
                        },
                    },
                    find: { $arrayElemAt: [AR_DIGITS, "$$this"] },
                    replacement: { $toString: "$$this" },
                },
            },
        },
    };

    const toNumber = (index) => ({
        $convert: {
            input: { $arrayElemAt: ["$$parts", index] },
            to: "double",
            onError: null,
            onNull: null,
        },
    });

    return {
        $let: {
            vars: { parts: { $split: [asciiDate, "/"] } },
            in: {
                $cond: [
                    { $eq: [{ $size: "$$parts" }, 3] },
                    {
                        $add: [
                            { $multiply: [toNumber(0), 10000] },
                            { $multiply: [toNumber(1), 100] },
                            toNumber(2),
                        ],
                    },
                    null,
                ],
            },
        },
    };
}

/* ======================================================
   POST /api/reports
   فیلتر، شمارش و صفحه‌بندی گزارش داخل دیتابیس
====================================================== */

export async function POST(request) {
    try {
        await connectDB();

        const body = await request.json();

        const requestedPage = Math.max(Number(body.page) || 1, 1);

        const limit = Math.min(
            Math.max(Number(body.limit) || 50, 1),
            1000
        );

        /* -------- فیلترهای مستقیم -------- */

        const rawMatch = {};

        if (body.vehicle) {
            rawMatch.vehicleType = String(body.vehicle);
        }

        if (body.loadType) {
            rawMatch.loadType = String(body.loadType);
        }

        /* -------- فیلترهای یکسان‌شده -------- */

        const normalizedMatch = {};

        if (body.driver) {
            normalizedMatch.driverKey = String(body.driver);
        }

        if (body.company) {
            normalizedMatch.companyKey = String(body.company);
        }

        if (body.payment) {
            normalizedMatch.costTypeNorm = normJs(body.payment);
        }

        // مبدأ: شهر یا همه شهرهای استان
        if (body.originCity) {
            normalizedMatch.originNorm = normJs(body.originCity);
        } else if (
            Array.isArray(body.originCities) &&
            body.originCities.length > 0
        ) {
            normalizedMatch.originNorm = {
                $in: body.originCities.map(normJs),
            };
        }

        // مقصد: شهر یا همه شهرهای استان
        if (body.destinationCity) {
            normalizedMatch.destinationNorm = normJs(
                body.destinationCity
            );
        } else if (
            Array.isArray(body.destinationCities) &&
            body.destinationCities.length > 0
        ) {
            normalizedMatch.destinationNorm = {
                $in: body.destinationCities.map(normJs),
            };
        }

        /* -------- تاریخ -------- */

        const fromDate = Number(body.fromDate) || null;
        const toDate = Number(body.toDate) || null;
        const needDate = Boolean(fromDate || toDate);

        if (needDate) {
            normalizedMatch.dateNum = {};

            if (fromDate) {
                normalizedMatch.dateNum.$gte = fromDate;
            }

            if (toDate) {
                normalizedMatch.dateNum.$lte = toDate;
            }
        }

        /* -------- فیلدهای کمکی -------- */

        const addFields = {
            originNorm: normExpr("$origin"),
            destinationNorm: normExpr("$destination"),
            costTypeNorm: normExpr("$costType"),
            driverKey: keyExpr("$driverName", "$driverId"),
            companyKey: keyExpr("$companyName", "$companyId"),
        };

        if (needDate) {
            addFields.dateNum = dateNumExpr();
        }

        /* -------- اجرای گزارش -------- */

        async function runReport(page) {
            const pipeline = [
                { $match: rawMatch },
                { $addFields: addFields },
                { $match: normalizedMatch },
                {
                    $facet: {
                        rows: [
                            { $sort: { createdAt: -1, _id: -1 } },
                            { $skip: (page - 1) * limit },
                            { $limit: limit },
                            {
                                $project: {
                                    _id: 1,
                                    invoiceNumber: 1,
                                    driverName: 1,
                                    companyName: 1,
                                    loadType: 1,
                                    vehicleType: 1,
                                    origin: 1,
                                    destination: 1,
                                    distance: 1,
                                    cost: 1,
                                    costType: 1,
                                    date: 1,
                                },
                            },
                        ],

                        summary: [
                            {
                                $group: {
                                    _id: null,
                                    count: { $sum: 1 },
                                    totalDistance: {
                                        $sum: "$distance",
                                    },
                                    totalCost: { $sum: "$cost" },
                                    drivers: {
                                        $addToSet: "$driverKey",
                                    },
                                    companies: {
                                        $addToSet: "$companyKey",
                                    },
                                },
                            },
                        ],
                    },
                },
            ];

            const [result] = await Invoice.aggregate(pipeline);

            const summaryRow = result?.summary?.[0];

            const count = summaryRow?.count || 0;

            return {
                rows: result?.rows || [],

                summary: {
                    count,
                    totalDistance: summaryRow?.totalDistance || 0,
                    totalCost: summaryRow?.totalCost || 0,
                    uniqueDrivers: (summaryRow?.drivers || []).filter(
                        Boolean
                    ).length,
                    uniqueCompanies: (
                        summaryRow?.companies || []
                    ).filter(Boolean).length,
                },
            };
        }

        let page = requestedPage;
        let report = await runReport(page);

        const totalPages = Math.max(
            1,
            Math.ceil(report.summary.count / limit)
        );

        // اگر شماره صفحه از تعداد صفحات بیشتر باشد
        if (page > totalPages) {
            page = totalPages;
            report = await runReport(page);
        }

        /* -------- گزینه‌های فیلتر (فقط بار اول) -------- */

        let filterOptions;

        if (body.includeOptions) {
            const keyedOptions = (nameField, idField, key) => [
                {
                    $addFields: {
                        [key]: keyExpr(nameField, idField),
                    },
                },
                {
                    $group: {
                        _id: `$${key}`,
                        label: { $max: nameField },
                    },
                },
                { $match: { _id: { $ne: "" } } },
                { $sort: { label: 1 } },
            ];

            const [drivers, companies, vehicleTypes, loadTypes] =
                await Promise.all([
                    Invoice.aggregate(
                        keyedOptions(
                            "$driverName",
                            "$driverId",
                            "driverKey"
                        )
                    ),
                    Invoice.aggregate(
                        keyedOptions(
                            "$companyName",
                            "$companyId",
                            "companyKey"
                        )
                    ),
                    Invoice.distinct("vehicleType"),
                    Invoice.distinct("loadType"),
                ]);

            filterOptions = {
                drivers: drivers.map((item) => ({
                    value: item._id,
                    label: item.label || "بدون نام",
                })),

                companies: companies.map((item) => ({
                    value: item._id,
                    label: item.label || "بدون نام",
                })),

                vehicleTypes: vehicleTypes.filter(Boolean).sort(),

                loadTypes: loadTypes.filter(Boolean).sort(),
            };
        }

        /* -------- مجموع کل سیستم (بدون فیلتر) -------- */

        const [
            totalInvoices,
            totalPendingLoads,
            totalDrivers,
            totalCompanies,
        ] = await Promise.all([
            Invoice.countDocuments({}),
            Load.countDocuments({}),
            Driver.countDocuments({}),
            Company.countDocuments({}),
        ]);

        return NextResponse.json({
            success: true,

            totals: {
                invoices: totalInvoices,
                pendingLoads: totalPendingLoads,
                drivers: totalDrivers,
                companies: totalCompanies,
            },

            rows: report.rows,

            summary: report.summary,

            pagination: {
                page,
                limit,
                total: report.summary.count,
                totalPages,
            },

            ...(filterOptions ? { filterOptions } : {}),
        });
    } catch (error) {
        console.error("POST /api/reports error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "خطا در دریافت گزارش.",
                error: error.message,
            },
            { status: 500 }
        );
    }
}