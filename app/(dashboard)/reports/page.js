"use client";

import { useEffect, useMemo, useState } from "react";

import {
    BarChart3,
    User,
    Truck,
    Building2,
    Package,
    MapPin,
    Navigation,
    CreditCard,
    ClipboardList,
    CalendarDays,
    Search,
    RotateCcw,
    FileText,
    Route,
    Users,
    Wallet,
    Printer,
    X,
} from "lucide-react";

import {
    getProvincesList,
    getCities,
} from "@code-plate/iran-cities";

import PersianDatePicker from "@/components/drivers/PersianDatePicker";

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(number) {
    return new Intl.NumberFormat("fa-IR").format(
        Number(number || 0)
    );
}

function normalizeDigits(value) {
    return String(value ?? "")
        .replace(/[۰-۹]/g, (digit) =>
            "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
        )
        .replace(/[٠-٩]/g, (digit) =>
            "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
        );
}

function normalizeDateValue(value) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return normalizeDigits(value);
    }

    if (value?.format) {
        return normalizeDigits(
            value.format("YYYY/MM/DD")
        );
    }

    return "";
}

function dateToNumber(value) {
    if (!value) {
        return null;
    }

    const normalized = normalizeDateValue(value);

    const match = normalized.match(
        /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
    );

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    return (
        year * 10000 +
        month * 100 +
        day
    );
}

/* =========================================================
   DISPLAY LABELS
========================================================= */

const VEHICLE_TYPE_LABELS = {
    truck: "کامیون",
    trailer: "تریلی",
    pickup: "نیسان",
    van: "وانت",
};

const LOAD_TYPE_LABELS = {
    food: "مواد غذایی",
    industrial: "قطعات صنعتی",
    construction: "مصالح ساختمانی",
    agriculture: "محصولات کشاورزی",
    other: "سایر",
};

function getVehicleTypeLabel(value) {
    return VEHICLE_TYPE_LABELS[value] || value || "—";
}

function getLoadTypeLabel(value) {
    return LOAD_TYPE_LABELS[value] || value || "—";
}

/* =========================================================
   FILTER SELECT
========================================================= */

function FilterSelect({
    icon: Icon,
    label,
    value,
    onChange,
    options,
}) {
    return (
        <div className="report-filter-item">
            <label>{label}</label>

            <div className="report-select-wrapper">
                <Icon size={17} />

                <select
                    value={value}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                >
                    {options.map((option) => (
                        <option
                            key={option.value ?? option}
                            value={option.value ?? option}
                        >
                            {option.label ?? option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}


/* =========================================================
   PRINT PREVIEW
========================================================= */

function PrintReportPreview({
    data,
    totalDistance,
    totalCost,
    uniqueDrivers,
    uniqueCompanies,
    onClose,
}) {
    const rowsPerPage = 12;

    useEffect(() => {
        const handleAfterPrint = () => {
            document.body.classList.remove(
                "printing-report"
            );
        };

        window.addEventListener(
            "afterprint",
            handleAfterPrint
        );

        return () => {
            window.removeEventListener(
                "afterprint",
                handleAfterPrint
            );

            document.body.classList.remove(
                "printing-report"
            );
        };
    }, []);

    const pages = [];

    for (let i = 0; i < data.length; i += rowsPerPage) {
        pages.push(data.slice(i, i + rowsPerPage));
    }

    if (pages.length === 0) {
        pages.push([]);
    }

    return (
        <div className="reports-print-modal">

            <div className="reports-print-toolbar no-print">

                <div className="reports-print-toolbar-title">
                    <strong>پیش‌نمایش چاپ گزارش</strong>
                    <span>
                        {formatNumber(pages.length)} صفحه A4
                    </span>
                </div>

                <div className="reports-print-toolbar-actions">
                    <button
                        type="button"
                        className="reports-print-button"
                        onClick={() => {
                            document.body.classList.add("printing-report");

                            setTimeout(() => {
                                window.print();
                            }, 100);
                        }}

                    >
                        <Printer size={17} />
                        چاپ گزارش
                    </button>



                    <button
                        type="button"
                        className="reports-close-print-button"
                        onClick={onClose}
                        aria-label="بستن پیش‌نمایش"
                    >
                        <X size={20} />
                    </button>
                </div>

            </div>

            <div className="reports-print-scroll">
                <div className="reports-print-document">

                    {pages.map((pageRows, pageIndex) => (
                        <section
                            className={`report-a4-page ${pageIndex === pages.length - 1
                                ? "last-report-page"
                                : ""
                                }`}
                            key={pageIndex}
                        >

                            <header className="report-a4-header">

                                <div>
                                    <h1>
                                        موسسه حمل و نقل کامران
                                    </h1>

                                    <p>
                                        گزارش عملکرد سیستم حمل‌ونقل
                                    </p>
                                </div>

                                <div className="report-a4-meta">
                                    <span>
                                        تاریخ چاپ:{" "}
                                        {new Intl.DateTimeFormat(
                                            "fa-IR"
                                        ).format(new Date())}
                                    </span>

                                    <span>
                                        صفحه{" "}
                                        {formatNumber(pageIndex + 1)}
                                        {" "}از{" "}
                                        {formatNumber(pages.length)}
                                    </span>
                                </div>

                            </header>

                            <div className="report-a4-summary">

                                <div>
                                    <span>تعداد بار</span>
                                    <strong>
                                        {formatNumber(data.length)}
                                    </strong>
                                </div>

                                <div>
                                    <span>مسافت کل</span>
                                    <strong>
                                        {formatNumber(totalDistance)} کیلومتر
                                    </strong>
                                </div>

                                <div>
                                    <span>هزینه کل</span>
                                    <strong>
                                        {formatNumber(totalCost)} تومان
                                    </strong>
                                </div>

                                <div>
                                    <span>رانندگان</span>
                                    <strong>
                                        {formatNumber(uniqueDrivers)}
                                    </strong>
                                </div>

                                <div>
                                    <span>شرکت‌ها</span>
                                    <strong>
                                        {formatNumber(uniqueCompanies)}
                                    </strong>
                                </div>

                            </div>

                            <div className="report-a4-table-wrap">

                                <table className="report-a4-table">

                                    <thead>
                                        <tr>
                                            <th>ردیف</th>
                                            <th>راننده</th>
                                            <th>شرکت</th>
                                            <th>نوع بار</th>
                                            <th>ماشین</th>
                                            <th>مسیر</th>
                                            <th>مسافت</th>
                                            <th>هزینه</th>
                                            <th>تاریخ</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {pageRows.map(
                                            (item, rowIndex) => (
                                                <tr
                                                    key={
                                                        item._id ||
                                                        `${pageIndex}-${rowIndex}`
                                                    }
                                                >
                                                    <td>
                                                        {formatNumber(
                                                            pageIndex *
                                                            rowsPerPage +
                                                            rowIndex +
                                                            1
                                                        )}
                                                    </td>

                                                    <td>
                                                        {item.driverName || "—"}
                                                    </td>

                                                    <td>
                                                        {item.companyName || "—"}
                                                    </td>

                                                    <td>
                                                        {getLoadTypeLabel(
                                                            item.loadType
                                                        )}
                                                    </td>

                                                    <td>
                                                        {getVehicleTypeLabel(
                                                            item.vehicleType
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="report-a4-route">
                                                            <span>
                                                                {item.origin || "—"}
                                                            </span>

                                                            <span>←</span>

                                                            <span>
                                                                {item.destination || "—"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {formatNumber(
                                                            item.distance
                                                        )}{" "}
                                                        کیلومتر
                                                    </td>

                                                    <td>
                                                        {formatNumber(item.cost)}
                                                    </td>

                                                    <td>
                                                        {normalizeDateValue(
                                                            item.date
                                                        ) || "—"}
                                                    </td>
                                                </tr>
                                            )
                                        )}

                                        {pageRows.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="9"
                                                    className="report-a4-empty"
                                                >
                                                    گزارشی برای چاپ وجود ندارد.
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            <footer className="report-a4-footer">
                                <span>
                                    این گزارش بر اساس اطلاعات ثبت‌شده در سیستم تهیه شده است.
                                </span>

                                <span>
                                    صفحه{" "}
                                    {formatNumber(pageIndex + 1)}
                                    {" "}از{" "}
                                    {formatNumber(pages.length)}
                                </span>
                            </footer>

                        </section>
                    ))}

                </div>
            </div>

            <style jsx global>{`
    .reports-print-modal {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(8, 15, 30, 0.82);
        backdrop-filter: blur(8px);
        display: flex;
        flex-direction: column;
    }

    .reports-print-toolbar {
        min-height: 72px;
        padding: 12px 20px;
        background: var(--card-bg, #ffffff);
        border-bottom: 1px solid var(--border-color, #e5e7eb);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        direction: rtl;
    }

    .reports-print-toolbar-title {
        display: flex;
        align-items: center;
        gap: 14px;
    }

    .reports-print-toolbar strong {
        font-size: 17px;
        color: var(--text-primary, #111827);
    }

    .reports-print-toolbar span {
        color: var(--text-secondary, #6b7280);
        font-size: 13px;
    }

    .reports-print-toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .reports-print-button,
    .reports-close-print-button {
        border: 0;
        cursor: pointer;
        border-radius: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
    }

    .reports-print-button {
        padding: 0 16px;
        background: #2563eb;
        color: #ffffff;
        font-weight: 700;
    }

    .reports-close-print-button {
        width: 42px;
        background: #eef2f7;
        color: #374151;
    }

    .reports-print-scroll {
        flex: 1;
        overflow: auto;
        padding: 28px 20px 50px;
    }

    .reports-print-document {
        width: max-content;
        min-width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
    }

    .report-a4-page {
        width: 297mm;
        height: 210mm;
        min-height: 210mm;
        box-sizing: border-box;
        background: #ffffff;
        color: #111827;
        padding: 11mm 12mm 9mm;
        direction: rtl;
        display: flex;
        flex-direction: column;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.22);
        font-family: Arial, Tahoma, sans-serif;
        overflow: hidden;
    }

    .report-a4-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        padding-bottom: 9px;
        border-bottom: 2px solid #111827;
        flex-shrink: 0;
    }

    .report-a4-header h1 {
        margin: 0 0 5px;
        font-size: 22px;
    }

    .report-a4-header p {
        margin: 0;
        font-size: 13px;
        color: #4b5563;
    }

    .report-a4-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
        text-align: left;
        font-size: 11px;
        color: #4b5563;
        white-space: nowrap;
    }

    .report-a4-summary {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 7px;
        margin: 10px 0;
        flex-shrink: 0;
    }

    .report-a4-summary > div {
        border: 1px solid #cbd5e1;
        border-radius: 7px;
        padding: 8px 7px;
        text-align: center;
    }

    .report-a4-summary span {
        display: block;
        font-size: 10px;
        color: #6b7280;
        margin-bottom: 4px;
    }

    .report-a4-summary strong {
        display: block;
        font-size: 12px;
    }

    .report-a4-table-wrap {
        flex: 1;
        min-height: 0;
        overflow: hidden;
    }

    .report-a4-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        font-size: 11px;
    }

    .report-a4-table th,
    .report-a4-table td {
        border: 1px solid #9ca3af;
        padding: 8px 6px;
        min-height: 34px;
        text-align: center;
        vertical-align: middle;
        word-break: break-word;
        line-height: 1.65;
    }

    .report-a4-table th {
        background: #e5e7eb;
        font-weight: 800;
        font-size: 11px;
    }

    .report-a4-table tbody tr:nth-child(even) {
        background: #f9fafb;
    }

    .report-a4-route {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }

    .report-a4-empty {
        height: 70px;
        color: #6b7280;
    }

    .report-a4-footer {
        margin-top: 8px;
        padding-top: 7px;
        border-top: 1px solid #d1d5db;
        display: flex;
        justify-content: space-between;
        gap: 15px;
        font-size: 9px;
        color: #6b7280;
        flex-shrink: 0;
    }

    /* =====================================================
       PRINT
    ===================================================== */

    @media print {

        @page {
            size: A4 landscape;
            margin: 0;
        }

        html {
            width: 100%;
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
        }

        body {
            width: 100%;
            height: auto;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
        }

        /* همه چیز مخفی، فقط گزارش قابل چاپ */
        body.printing-report {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
        }

        body.printing-report > * {
            visibility: hidden !important;
        }

        body.printing-report .reports-print-modal,
        body.printing-report .reports-print-modal * {
            visibility: visible !important;
        }

        /* خود مودال از حالت fixed خارج می‌شود */
        body.printing-report .reports-print-modal {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;

            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            display: block !important;

            background: #ffffff !important;
            overflow: visible !important;

            backdrop-filter: none !important;
        }

        /* دکمه‌ها و نوار بالا چاپ نشوند */
        body.printing-report .no-print {
            display: none !important;
        }

        /* اسکرولر */
        body.printing-report .reports-print-scroll {
            display: block !important;

            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            overflow: visible !important;
        }

        /* کانتینر صفحات */
        body.printing-report .reports-print-document {
            display: block !important;

            width: 100% !important;
            min-width: 0 !important;

            margin: 0 !important;
            padding: 0 !important;

            gap: 0 !important;
        }

        /*
         * هر section = دقیقاً یک صفحه
         *
         * 209mm عمداً استفاده شده تا خطای رند شدن
         * مرورگر باعث پرتاب محتوا به صفحه بعد نشود.
         */
        body.printing-report .report-a4-page {
            display: flex !important;
            flex-direction: column !important;

            width: 100% !important;

            height: 209mm !important;
            min-height: 209mm !important;
            max-height: 209mm !important;

            box-sizing: border-box !important;

            margin: 0 !important;

            padding: 10mm 11mm 8mm !important;

            background: #ffffff !important;

            box-shadow: none !important;

            overflow: hidden !important;

            direction: rtl !important;

            break-inside: avoid !important;
            page-break-inside: avoid !important;
        }

        /*
         * فقط بین صفحات شکست ایجاد شود
         */
        body.printing-report
        .report-a4-page:not(:last-child) {
            break-after: page !important;
            page-break-after: always !important;
        }

        /*
         * صفحه آخر هیچ شکست اضافه‌ای نداشته باشد
         */
        body.printing-report
        .report-a4-page:last-child {
            break-after: auto !important;
            page-break-after: auto !important;
        }

        /*
         * جدول
         */
        body.printing-report .report-a4-table-wrap {
            flex: 1 1 auto !important;
            min-height: 0 !important;

            overflow: hidden !important;
        }

        body.printing-report .report-a4-table {
            width: 100% !important;

            border-collapse: collapse !important;

            table-layout: fixed !important;

            font-size: 10.5px !important;
        }

        body.printing-report .report-a4-table thead {
            display: table-header-group !important;
        }

        body.printing-report .report-a4-table tbody {
            display: table-row-group !important;
        }

        body.printing-report .report-a4-table tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
        }

        body.printing-report .report-a4-table th,
        body.printing-report .report-a4-table td {
            break-inside: avoid !important;
            page-break-inside: avoid !important;

            padding: 6px 5px !important;

            line-height: 1.5 !important;
        }

        /*
         * اجزای صفحه جابه‌جا نشوند
         */
        body.printing-report .report-a4-header {
            flex-shrink: 0 !important;
        }

        body.printing-report .report-a4-summary {
            flex-shrink: 0 !important;
        }

        body.printing-report .report-a4-footer {
            flex-shrink: 0 !important;
        }

        /*
         * رنگ جدول هنگام چاپ
         */
        body.printing-report .report-a4-table th {
            background: #e5e7eb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        body.printing-report .report-a4-table tbody tr:nth-child(even) {
            background: #f9fafb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        /*
         * جلوگیری از فاصله‌های ناخواسته
         */
        body.printing-report h1,
        body.printing-report h2,
        body.printing-report h3,
        body.printing-report p,
        body.printing-report table {
            margin-top: 0;
        }
    }
`}</style>

        </div>
    );
}

/* =========================================================
   PAGE
========================================================= */

export default function ReportsPage() {
    /* =====================================================
       REAL LOCATION DATA
    ===================================================== */

    const provinces = useMemo(
        () => getProvincesList(),
        []
    );

    /* =====================================================
       DATABASE DATA
    ===================================================== */

    const [invoices, setInvoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /* =====================================================
       FILTER DATA
    ===================================================== */

    const [drivers, setDrivers] =
        useState([]);

    const [companies, setCompanies] =
        useState([]);

    /* =====================================================
       FILTERS
    ===================================================== */

    const [filters, setFilters] =
        useState({
            driver: "",
            vehicle: "",
            company: "",
            loadType: "",
            originProvince: "",
            originCity: "",
            destinationProvince: "",
            destinationCity: "",
            payment: "",
            fromDate: null,
            toDate: null,
        });

    const [showPrintPreview, setShowPrintPreview] =
        useState(false);

    /* =====================================================
       LOAD REAL DATA
    ===================================================== */

    useEffect(() => {
        async function loadReportData() {
            try {
                setLoading(true);
                setError("");

                const [
                    invoicesResponse,
                    driversResponse,
                    companiesResponse,
                ] = await Promise.all([
                    fetch(
                        "/api/invoices",
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        "/api/drivers",
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        "/api/companies",
                        {
                            cache: "no-store",
                        }
                    ),
                ]);

                /* -----------------------------------------
                   INVOICES
                ----------------------------------------- */

                if (invoicesResponse.ok) {
                    const result =
                        await invoicesResponse.json();

                    const invoiceList =
                        Array.isArray(result)
                            ? result
                            : Array.isArray(
                                result.invoices
                            )
                                ? result.invoices
                                : [];

                    setInvoices(
                        invoiceList
                    );
                }

                /* -----------------------------------------
                   DRIVERS
                ----------------------------------------- */

                if (driversResponse.ok) {
                    const result =
                        await driversResponse.json();

                    const driverList =
                        Array.isArray(result)
                            ? result
                            : Array.isArray(
                                result.drivers
                            )
                                ? result.drivers
                                : [];

                    setDrivers(
                        driverList
                    );
                }

                /* -----------------------------------------
                   COMPANIES
                ----------------------------------------- */

                if (companiesResponse.ok) {
                    const result =
                        await companiesResponse.json();

                    const companyList =
                        Array.isArray(result)
                            ? result
                            : Array.isArray(
                                result.companies
                            )
                                ? result.companies
                                : [];

                    setCompanies(
                        companyList
                    );
                }
            } catch (err) {
                console.error(
                    "Reports data error:",
                    err
                );

                setError(
                    "دریافت اطلاعات گزارشات انجام نشد."
                );
            } finally {
                setLoading(false);
            }
        }

        loadReportData();
    }, []);

    /* =====================================================
       ORIGIN CITIES
    ===================================================== */

    const originCities = useMemo(() => {
        if (!filters.originProvince) {
            return [];
        }

        return getCities(
            filters.originProvince
        );
    }, [filters.originProvince]);

    /* =====================================================
       DESTINATION CITIES
    ===================================================== */

    const destinationCities = useMemo(() => {
        if (!filters.destinationProvince) {
            return [];
        }

        return getCities(
            filters.destinationProvince
        );
    }, [
        filters.destinationProvince,
    ]);

    /* =====================================================
       REAL FILTER OPTIONS
    ===================================================== */

    const driverOptions = useMemo(() => {
        return [
            {
                value: "",
                label: "همه رانندگان",
            },

            ...drivers.map((driver) => ({
                value:
                    driver._id ||
                    driver.name ||
                    "",

                label:
                    driver.name ||
                    "بدون نام",
            })),
        ];
    }, [drivers]);

    const companyOptions = useMemo(() => {
        return [
            {
                value: "",
                label: "همه شرکت‌ها",
            },

            ...companies.map((company) => ({
                value:
                    company._id ||
                    company.name ||
                    "",

                label:
                    company.name ||
                    "بدون نام",
            })),
        ];
    }, [companies]);

    const vehicleOptions = useMemo(() => {
        const values = [
            ...new Set(
                invoices
                    .map(
                        (invoice) =>
                            invoice.vehicleType
                    )
                    .filter(Boolean)
            ),
        ];

        return [
            {
                value: "",
                label: "همه ماشین‌ها",
            },

            ...values.map((value) => ({
                value,
                label: getVehicleTypeLabel(value),
            })),
        ];
    }, [invoices]);

    const loadTypeOptions = useMemo(() => {
        const values = [
            ...new Set(
                invoices
                    .map(
                        (invoice) =>
                            invoice.loadType
                    )
                    .filter(Boolean)
            ),
        ];

        return [
            {
                value: "",
                label: "همه انواع بار",
            },

            ...values.map((value) => ({
                value,
                label: getLoadTypeLabel(value),
            })),
        ];
    }, [invoices]);

    const paymentOptions = [
        {
            value: "",
            label: "همه",
        },
        {
            value: "اعتباری",
            label: "اعتباری",
        },
        {
            value: "نقد",
            label: "نقد",
        },
    ];

    /* =====================================================
       FILTER UPDATE
    ===================================================== */

    function updateFilter(
        field,
        value
    ) {
        setFilters((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    function resetFilters() {
        setFilters({
            driver: "",
            vehicle: "",
            company: "",
            loadType: "",
            originProvince: "",
            originCity: "",
            destinationProvince: "",
            destinationCity: "",
            payment: "",
            fromDate: null,
            toDate: null,
        });
    }

    /* =====================================================
       FILTERED REPORT
    ===================================================== */

    const filteredData = useMemo(() => {
        const fromDate =
            dateToNumber(
                filters.fromDate
            );

        const toDate =
            dateToNumber(
                filters.toDate
            );

        return invoices.filter(
            (invoice) => {

                /* -----------------------------------------
                   DRIVER
                ----------------------------------------- */

                if (
                    filters.driver &&
                    String(
                        invoice.driverId?._id ||
                        invoice.driverId ||
                        ""
                    ) !==
                    String(
                        filters.driver
                    ) &&
                    String(
                        invoice.driverName ||
                        ""
                    ) !==
                    String(
                        filters.driver
                    )
                ) {
                    return false;
                }

                /* -----------------------------------------
                   VEHICLE
                ----------------------------------------- */

                if (
                    filters.vehicle &&
                    invoice.vehicleType !==
                    filters.vehicle
                ) {
                    return false;
                }

                /* -----------------------------------------
                   COMPANY
                ----------------------------------------- */

                if (
                    filters.company &&
                    String(
                        invoice.companyId?._id ||
                        invoice.companyId ||
                        ""
                    ) !==
                    String(
                        filters.company
                    ) &&
                    String(
                        invoice.companyName ||
                        ""
                    ) !==
                    String(
                        filters.company
                    )
                ) {
                    return false;
                }

                /* -----------------------------------------
                   LOAD TYPE
                ----------------------------------------- */

                if (
                    filters.loadType &&
                    invoice.loadType !==
                    filters.loadType
                ) {
                    return false;
                }

                /* -----------------------------------------
                   ORIGIN CITY
                ----------------------------------------- */

                if (
                    filters.originCity &&
                    invoice.origin !==
                    filters.originCity
                ) {
                    return false;
                }

                /* -----------------------------------------
                   DESTINATION CITY
                ----------------------------------------- */

                if (
                    filters.destinationCity &&
                    invoice.destination !==
                    filters.destinationCity
                ) {
                    return false;
                }

                /* -----------------------------------------
                   PAYMENT
                ----------------------------------------- */

                if (
                    filters.payment &&
                    invoice.costType !==
                    filters.payment
                ) {
                    return false;
                }

                /* -----------------------------------------
                   DATE
                ----------------------------------------- */

                if (
                    fromDate ||
                    toDate
                ) {
                    const invoiceDate =
                        normalizeDateValue(
                            invoice.date
                        );

                    const invoiceDateNumber =
                        dateToNumber(
                            invoiceDate
                        );

                    if (
                        invoiceDateNumber ===
                        null
                    ) {
                        return false;
                    }

                    if (
                        fromDate &&
                        invoiceDateNumber <
                        fromDate
                    ) {
                        return false;
                    }

                    if (
                        toDate &&
                        invoiceDateNumber >
                        toDate
                    ) {
                        return false;
                    }
                }

                return true;
            }
        );
    }, [
        invoices,
        filters,
    ]);

    /* =====================================================
       SUMMARY
    ===================================================== */

    const totalDistance =
        filteredData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.distance || 0
                ),
            0
        );

    const totalCost =
        filteredData.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.cost || 0
                ),
            0
        );

    const uniqueDrivers =
        new Set(
            filteredData.map(
                (item) =>
                    item.driverName ||
                    item.driverId?._id ||
                    item.driverId
            )
        ).size;

    const uniqueCompanies =
        new Set(
            filteredData.map(
                (item) =>
                    item.companyName ||
                    item.companyId?._id ||
                    item.companyId
            )
        ).size;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <main className="main-content reports-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="reports-page-header">

                <div className="reports-heading">

                    <div className="reports-heading-icon">
                        <BarChart3
                            size={24}
                        />
                    </div>

                    <div>

                        <h1>
                            گزارشات
                        </h1>

                        <p>
                            دریافت گزارش بر اساس اطلاعات ثبت‌شده در سیستم
                        </p>

                    </div>

                </div>

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <section className="reports-filter-panel">

                <div className="reports-section-header">

                    <div className="reports-section-title">

                        <div className="reports-section-icon">
                            <ClipboardList
                                size={19}
                            />
                        </div>

                        <div>

                            <h2>
                                فیلتر گزارش
                            </h2>

                            <p>
                                اطلاعات مورد نظر برای گزارش را انتخاب کنید
                            </p>

                        </div>

                    </div>

                </div>

                <div className="reports-filter-grid">

                    {/* DRIVER */}

                    <FilterSelect
                        icon={User}
                        label="راننده"
                        value={
                            filters.driver
                        }
                        onChange={(value) =>
                            updateFilter(
                                "driver",
                                value
                            )
                        }
                        options={
                            driverOptions
                        }
                    />

                    {/* VEHICLE */}

                    <FilterSelect
                        icon={Truck}
                        label="نوع ماشین"
                        value={
                            filters.vehicle
                        }
                        onChange={(value) =>
                            updateFilter(
                                "vehicle",
                                value
                            )
                        }
                        options={
                            vehicleOptions
                        }
                    />

                    {/* COMPANY */}

                    <FilterSelect
                        icon={Building2}
                        label="شرکت"
                        value={
                            filters.company
                        }
                        onChange={(value) =>
                            updateFilter(
                                "company",
                                value
                            )
                        }
                        options={
                            companyOptions
                        }
                    />

                    {/* LOAD TYPE */}

                    <FilterSelect
                        icon={Package}
                        label="نوع بار"
                        value={
                            filters.loadType
                        }
                        onChange={(value) =>
                            updateFilter(
                                "loadType",
                                value
                            )
                        }
                        options={
                            loadTypeOptions
                        }
                    />

                    {/* ORIGIN PROVINCE */}

                    <FilterSelect
                        icon={MapPin}
                        label="استان مبدا"
                        value={
                            filters.originProvince
                        }
                        onChange={(value) => {
                            setFilters(
                                (previous) => ({
                                    ...previous,
                                    originProvince:
                                        value,
                                    originCity:
                                        "",
                                })
                            );
                        }}
                        options={[
                            {
                                value: "",
                                label:
                                    "همه استان‌ها",
                            },

                            ...provinces.map(
                                (province) => ({
                                    value:
                                        province.en,
                                    label:
                                        province.fa,
                                })
                            ),
                        ]}
                    />

                    {/* ORIGIN CITY */}

                    <FilterSelect
                        icon={MapPin}
                        label="شهر مبدا"
                        value={
                            filters.originCity
                        }
                        onChange={(value) =>
                            updateFilter(
                                "originCity",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    filters.originProvince
                                        ? "همه شهرها"
                                        : "ابتدا استان",
                            },

                            ...originCities.map(
                                (city) => ({
                                    value:
                                        city.fa,
                                    label:
                                        city.fa,
                                })
                            ),
                        ]}
                    />

                    {/* DESTINATION PROVINCE */}

                    <FilterSelect
                        icon={Navigation}
                        label="استان مقصد"
                        value={
                            filters.destinationProvince
                        }
                        onChange={(value) => {
                            setFilters(
                                (previous) => ({
                                    ...previous,
                                    destinationProvince:
                                        value,
                                    destinationCity:
                                        "",
                                })
                            );
                        }}
                        options={[
                            {
                                value: "",
                                label:
                                    "همه استان‌ها",
                            },

                            ...provinces.map(
                                (province) => ({
                                    value:
                                        province.en,
                                    label:
                                        province.fa,
                                })
                            ),
                        ]}
                    />

                    {/* DESTINATION CITY */}

                    <FilterSelect
                        icon={Navigation}
                        label="شهر مقصد"
                        value={
                            filters.destinationCity
                        }
                        onChange={(value) =>
                            updateFilter(
                                "destinationCity",
                                value
                            )
                        }
                        options={[
                            {
                                value: "",
                                label:
                                    filters.destinationProvince
                                        ? "همه شهرها"
                                        : "ابتدا استان",
                            },

                            ...destinationCities.map(
                                (city) => ({
                                    value:
                                        city.fa,
                                    label:
                                        city.fa,
                                })
                            ),
                        ]}
                    />

                    {/* PAYMENT */}

                    <FilterSelect
                        icon={CreditCard}
                        label="نوع پرداخت"
                        value={
                            filters.payment
                        }
                        onChange={(value) =>
                            updateFilter(
                                "payment",
                                value
                            )
                        }
                        options={
                            paymentOptions
                        }
                    />

                    {/* FROM DATE */}

                    <div className="report-filter-item">

                        <label>
                            از تاریخ
                        </label>

                        <div className="report-date-wrapper">

                            <CalendarDays
                                size={17}
                            />

                            <PersianDatePicker
                                value={
                                    filters.fromDate
                                }
                                onChange={(value) =>
                                    updateFilter(
                                        "fromDate",
                                        value
                                    )
                                }
                                placeholder="انتخاب تاریخ شروع"
                            />

                        </div>

                    </div>

                    {/* TO DATE */}

                    <div className="report-filter-item">

                        <label>
                            تا تاریخ
                        </label>

                        <div className="report-date-wrapper">

                            <CalendarDays
                                size={17}
                            />

                            <PersianDatePicker
                                value={
                                    filters.toDate
                                }
                                onChange={(value) =>
                                    updateFilter(
                                        "toDate",
                                        value
                                    )
                                }
                                placeholder="انتخاب تاریخ پایان"
                            />

                        </div>

                    </div>

                </div>

                <div className="reports-filter-actions">

                    <button
                        type="button"
                        className="reports-reset-button"
                        onClick={
                            resetFilters
                        }
                    >
                        <RotateCcw
                            size={16}
                        />

                        پاک کردن فیلترها
                    </button>

                    <button
                        type="button"
                        className="reports-generate-button"
                    >
                        <Search
                            size={17}
                        />

                        دریافت گزارش
                    </button>

                </div>

            </section>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="reports-summary">

                <div className="reports-summary-card">

                    <div className="reports-summary-icon blue">
                        <FileText
                            size={20}
                        />
                    </div>

                    <div>

                        <span>
                            تعداد بار
                        </span>

                        <strong>
                            {formatNumber(
                                filteredData.length
                            )}
                        </strong>

                    </div>

                </div>

                <div className="reports-summary-card">

                    <div className="reports-summary-icon orange">
                        <Route
                            size={20}
                        />
                    </div>

                    <div>

                        <span>
                            مسافت کل
                        </span>

                        <strong>
                            {formatNumber(
                                totalDistance
                            )}{" "}
                            کیلومتر
                        </strong>

                    </div>

                </div>

                <div className="reports-summary-card">

                    <div className="reports-summary-icon green">
                        <Wallet
                            size={20}
                        />
                    </div>

                    <div>

                        <span>
                            هزینه کل
                        </span>

                        <strong>
                            {formatNumber(
                                totalCost
                            )}{" "}
                            تومان
                        </strong>

                    </div>

                </div>

                <div className="reports-summary-card">

                    <div className="reports-summary-icon purple">
                        <Users
                            size={20}
                        />
                    </div>

                    <div>

                        <span>
                            رانندگان
                        </span>

                        <strong>
                            {formatNumber(
                                uniqueDrivers
                            )}
                        </strong>

                    </div>

                </div>

                <div className="reports-summary-card">

                    <div className="reports-summary-icon cyan">
                        <Building2
                            size={20}
                        />
                    </div>

                    <div>

                        <span>
                            شرکت‌ها
                        </span>

                        <strong>
                            {formatNumber(
                                uniqueCompanies
                            )}
                        </strong>

                    </div>

                </div>

            </section>

            {/* =================================================
                RESULTS
            ================================================= */}

            <section className="reports-results">

                <div className="reports-results-header">

                    <div>

                        <h2>
                            نتایج گزارش
                        </h2>

                        <p>
                            {formatNumber(
                                filteredData.length
                            )}{" "}
                            مورد مطابق فیلترهای انتخاب‌شده
                        </p>

                    </div>

                    <button
                        type="button"
                        className="reports-export-button"
                        onClick={() =>
                            setShowPrintPreview(true)
                        }
                    >
                        <Printer size={16} />
                        پیش‌نمایش چاپ
                    </button>

                </div>

                {loading ? (

                    <div className="reports-empty">

                        <Search
                            size={35}
                        />

                        <strong>
                            در حال دریافت اطلاعات...
                        </strong>

                    </div>

                ) : error ? (

                    <div className="reports-empty">

                        <Search
                            size={35}
                        />

                        <strong>
                            {error}
                        </strong>

                    </div>

                ) : filteredData.length > 0 ? (

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>
                                    <th>
                                        راننده
                                    </th>

                                    <th>
                                        شرکت
                                    </th>

                                    <th>
                                        نوع بار
                                    </th>

                                    <th>
                                        ماشین
                                    </th>

                                    <th>
                                        مسیر
                                    </th>

                                    <th>
                                        مسافت
                                    </th>

                                    <th>
                                        هزینه
                                    </th>

                                    <th>
                                        تاریخ
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredData.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                item._id ||
                                                item.invoiceNumber ||
                                                index
                                            }
                                        >

                                            <td>

                                                <span className="report-driver-name">
                                                    {item.driverName ||
                                                        "—"}
                                                </span>

                                            </td>

                                            <td>
                                                {item.companyName ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {getLoadTypeLabel(
                                                    item.loadType
                                                )}
                                            </td>

                                            <td>

                                                <span className="report-vehicle">

                                                    <Truck
                                                        size={14}
                                                    />

                                                    {getVehicleTypeLabel(
                                                        item.vehicleType
                                                    )}

                                                </span>

                                            </td>

                                            <td>

                                                <div className="report-route-cell">

                                                    <span>
                                                        {item.origin ||
                                                            "—"}
                                                    </span>

                                                    <span>
                                                        ←
                                                    </span>

                                                    <span>
                                                        {item.destination ||
                                                            "—"}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                {formatNumber(
                                                    item.distance
                                                )}{" "}
                                                کیلومتر

                                            </td>

                                            <td>

                                                <strong className="report-cost">

                                                    {formatNumber(
                                                        item.cost
                                                    )}

                                                </strong>

                                            </td>

                                            <td>

                                                {normalizeDateValue(
                                                    item.date
                                                ) || "—"}

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="reports-empty">

                        <Search
                            size={35}
                        />

                        <strong>
                            گزارشی با این فیلترها پیدا نشد
                        </strong>

                        <span>
                            فیلترها را تغییر دهید و دوباره گزارش بگیرید.
                        </span>

                    </div>

                )}

            </section>

            {showPrintPreview && (
                <PrintReportPreview
                    data={filteredData}
                    totalDistance={totalDistance}
                    totalCost={totalCost}
                    uniqueDrivers={uniqueDrivers}
                    uniqueCompanies={uniqueCompanies}
                    onClose={() =>
                        setShowPrintPreview(false)
                    }
                />
            )}

        </main>
    );
}