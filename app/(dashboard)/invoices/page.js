"use client";

import {
    FileText,
    Plus,
    Search,
    Eye,
    X,
    CalendarDays,
    ChevronDown,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import PersianDatePicker from "@/components/drivers/PersianDatePicker";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { useNotification } from "@/components/ui/NotificationProvider";

/* =========================
   Persian Digits
========================= */

function toPersianDigits(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(
        /\d/g,
        (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}

/* =========================
   Format Amount
========================= */

function formatAmount(value) {
    const number = Number(value) || 0;

    return toPersianDigits(
        number.toLocaleString("en-US")
    );
}

/* =========================
   Normalize Invoice
========================= */

function normalizeInvoice(invoice) {
    const mongoId = invoice?._id
        ? String(invoice._id)
        : "";

    const driver =
        invoice?.driverName ||
        invoice?.dailyDriverId?.name ||
        invoice?.driverId?.name ||
        "—";

    const company =
        invoice?.companyName ||
        invoice?.companyId?.name ||
        "—";

    /*
     * ثبت‌کننده واقعی فاکتور
     *
     * اول createdByUserName را از خود Invoice می‌گیریم.
     *
     * اگر createdByUserName وجود نداشت ولی
     * createdByUserId populate شده بود،
     * username را از آن می‌گیریم.
     */
    const createdByUserName =
        invoice?.createdByUserName ||
        invoice?.createdByUserId?.username ||
        invoice?.createdByUserId?.name ||
        "—";

    return {
        id:
            invoice?.invoiceNumber ||
            invoice?.invoiceId ||
            mongoId ||
            "",

        mongoId,

        date:
            invoice?.date || "—",

        driver,

        company,

        origin:
            invoice?.origin || "—",

        destination:
            invoice?.destination || "—",

        amount:
            formatAmount(invoice?.cost),

        /*
         * ثبت‌کننده فاکتور
         */
        createdByUserName,

        /*
         * کل اطلاعات اصلی فاکتور
         */
        raw: {
            ...invoice,
            _id: mongoId,
        },
    };
}

/* =========================
   Make Preview Invoice
========================= */

function makePreviewInvoice(invoice) {
    if (!invoice) {
        return null;
    }

    /*
     * MongoDB ID
     */
    const invoiceMongoId =
        invoice?._id
            ? String(invoice._id)
            : "";

    /*
     * Company
     */
    const companyData =
        invoice?.companyId &&
            typeof invoice.companyId === "object"
            ? invoice.companyId
            : {};

    /*
     * Driver
     */
    const driverData =
        invoice?.driverId &&
            typeof invoice.driverId === "object"
            ? invoice.driverId
            : {};

    /*
     * Costs
     */
    const mainCost =
        Number(invoice?.cost) || 0;

    const insurance =
        Number(invoice?.insuranceCost) || 0;

    const workerCost =
        Number(invoice?.workerCost) || 0;

    const scaleCost =
        Number(invoice?.scaleCost) || 0;

    const stopCost =
        Number(invoice?.stopCost) || 0;

    const commissionCost =
        Number(invoice?.commissionCost) || 0;

    /*
     * Total
     */
    const total =
        mainCost +
        insurance +
        workerCost +
        scaleCost +
        stopCost +
        commissionCost;

    /*
     * Creator
     */
    const createdByUserName =
        invoice?.createdByUserName ||
        invoice?.createdByUserId?.username ||
        invoice?.createdByUserId?.name ||
        "—";

    const createdByUserId =
        invoice?.createdByUserId?._id
            ? String(invoice.createdByUserId._id)
            : invoice?.createdByUserId
                ? String(invoice.createdByUserId)
                : "";

    return {
        /*
         * MongoDB ID
         */
        _id: invoiceMongoId,

        mongoId: invoiceMongoId,

        /*
         * ثبت‌کننده فاکتور
         */
        createdByUserName,

        createdByUserId,

        /*
         * Company
         */
        companyName:
            companyData?.name ||
            invoice?.companyName ||
            "—",

        companyManager:
            companyData?.manager ||
            companyData?.managerName ||
            "",

        companyMobile:
            companyData?.mobile ||
            companyData?.mobileNumber ||
            "",

        companyPhone:
            companyData?.phone ||
            companyData?.phoneNumber ||
            "",

        /*
         * Invoice
         */
        number:
            invoice?.invoiceNumber ||
            invoice?.invoiceId ||
            "—",

        date:
            invoice?.date || "—",

        startTime:
            invoice?.startTime || "—",

        paymentType:
            invoice?.costType ||
            invoice?.paymentType ||
            "—",

        /*
         * Driver
         */
        driver:
            invoice?.driverName ||
            driverData?.name ||
            invoice?.dailyDriverId?.name ||
            "—",

        vehicle:
            invoice?.vehicleType ||
            driverData?.vehicleType ||
            "—",

        plate:
            invoice?.vehiclePlate ||
            driverData?.plate ||
            "—",

        /*
         * Client
         */
        clientCompanyName:
            invoice?.companyName ||
            companyData?.name ||
            "—",

        /*
         * Load
         */
        cargoType:
            invoice?.loadType ||
            "—",

        origin:
            invoice?.origin ||
            "—",

        destination:
            invoice?.destination ||
            "—",

        distance:
            invoice?.distance
                ? `${toPersianDigits(
                    invoice.distance
                )} کیلومتر`
                : "—",

        loadAddress:
            invoice?.address ||
            "—",

        /*
         * Costs
         */
        cost:
            formatAmount(mainCost),

        insurance:
            formatAmount(insurance),

        workerCost:
            formatAmount(workerCost),

        scaleCost:
            formatAmount(scaleCost),

        stopCost:
            formatAmount(stopCost),

        commissionCost:
            formatAmount(commissionCost),

        total:
            formatAmount(total),

        totalInWords:
            invoice?.totalInWords ||
            "—",

        /*
         * Other
         */
        receiverName:
            invoice?.receiverName ||
            "—",

        description:
            invoice?.description ||
            "",
    };
}

/* =========================
   Page
========================= */

export default function InvoicesPage() {
    /* =========================
       Notification System
    ========================= */

    const {
        showSuccess,
        showError,
        showWarning,
        showInfo,
    } = useNotification();

    const [search, setSearch] =
        useState("");

    const [company, setCompany] =
        useState("");

    const [driver, setDriver] =
        useState("");

    const [date, setDate] =
        useState("");

    const [invoices, setInvoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedInvoice, setSelectedInvoice] =
        useState(null);

    /* =========================
       Fetch Invoices + Polling
    ========================= */

    useEffect(() => {
        let cancelled = false;

        /*
         * مشخص می‌کند که این اولین دریافت
         * اطلاعات است یا Polling.
         */
        let firstLoad = true;

        async function fetchInvoices({
            showLoading = false,
            showNotificationOnError = false,
        } = {}) {
            try {
                /*
                 * فقط در بارگذاری اولیه
                 * Loading اصلی صفحه نمایش داده می‌شود.
                 *
                 * در Polling نمی‌گذاریم جدول
                 * هر ۵ ثانیه چشمک بزند.
                 */
                if (showLoading) {
                    setLoading(true);
                }

                const response = await fetch(
                    "/api/invoices",
                    {
                        cache: "no-store",
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.message ||
                        result?.error ||
                        "دریافت فاکتورها ناموفق بود."
                    );
                }

                /*
                 * API ممکن است مستقیماً آرایه
                 * یا object شامل invoices برگرداند.
                 */
                const invoiceList =
                    Array.isArray(result)
                        ? result
                        : result?.invoices || [];

                if (cancelled) {
                    return;
                }

                const normalizedInvoices =
                    invoiceList.map(
                        normalizeInvoice
                    );

                /*
                 * اطلاعات جدید
                 */
                setInvoices(
                    normalizedInvoices
                );

                /*
                 * خطای قبلی را پاک می‌کنیم.
                 */
                setError("");

                /*
                 * فقط اولین بار Loading را
                 * تمام می‌کنیم.
                 */
                if (firstLoad) {
                    firstLoad = false;
                    setLoading(false);
                }
            } catch (error) {
                console.error(
                    "Fetch invoices error:",
                    error
                );

                if (cancelled) {
                    return;
                }

                /*
                 * اگر اولین دریافت باشد،
                 * خطا را به کاربر اطلاع می‌دهیم.
                 */
                if (
                    firstLoad &&
                    showNotificationOnError
                ) {
                    showError(
                        error?.message ||
                        "خطا در دریافت فاکتورها.",
                        "خطا در دریافت فاکتورها"
                    );
                }

                /*
                 * در اولین دریافت اگر API خراب باشد،
                 * صفحه خطا نمایش داده می‌شود.
                 */
                if (firstLoad) {
                    setError(
                        error?.message ||
                        "خطا در دریافت فاکتورها."
                    );

                    setInvoices([]);

                    firstLoad = false;

                    setLoading(false);
                }

                /*
                 * اگر خطا مربوط به Polling باشد،
                 * اطلاعات قبلی دست‌نخورده باقی می‌ماند.
                 *
                 * بنابراین در Polling:
                 *
                 * ❌ setInvoices([])
                 * ❌ setLoading(true)
                 *
                 * انجام نمی‌دهیم.
                 */
            }
        }

        /*
         * =========================
         * Initial Fetch
         * =========================
         */

        fetchInvoices({
            showLoading: true,
            showNotificationOnError: true,
        });

        /*
         * =========================
         * Polling
         * =========================
         *
         * هر ۵ ثانیه Server بررسی می‌شود.
         */
        const pollingInterval =
            setInterval(() => {
                fetchInvoices({
                    showLoading: false,
                    showNotificationOnError: false,
                });
            }, 5000);

        /*
         * =========================
         * Instant Sync Event
         * =========================
         *
         * اگر در همین مرورگر:
         *
         * ثبت فاکتور
         * ویرایش فاکتور
         * حذف فاکتور
         *
         * اتفاق افتاد، منتظر Polling
         * نمی‌مانیم.
         */
        function handleInvoiceUpdate() {
            fetchInvoices({
                showLoading: false,
                showNotificationOnError: false,
            });
        }

        window.addEventListener(
            "invoice-data-updated",
            handleInvoiceUpdate
        );

        /*
         * =========================
         * Cleanup
         * =========================
         */
        return () => {
            cancelled = true;

            clearInterval(
                pollingInterval
            );

            window.removeEventListener(
                "invoice-data-updated",
                handleInvoiceUpdate
            );
        };
    }, [showError]);

    /* =========================
       Companies
    ========================= */

    const companies =
        useMemo(() => {
            return [
                ...new Set(
                    invoices
                        .map(
                            (invoice) =>
                                invoice.company
                        )
                        .filter(Boolean)
                ),
            ];
        }, [invoices]);

    /* =========================
       Drivers
    ========================= */

    const drivers =
        useMemo(() => {
            return [
                ...new Set(
                    invoices
                        .map(
                            (invoice) =>
                                invoice.driver
                        )
                        .filter(Boolean)
                ),
            ];
        }, [invoices]);

    /* =========================
       Filter
    ========================= */

    const filteredInvoices =
        useMemo(() => {
            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            const selectedDate =
                date &&
                    typeof date.format ===
                    "function"
                    ? date.format(
                        "YYYY/MM/DD"
                    )
                    : date;

            return invoices.filter(
                (invoice) => {
                    const matchesSearch =
                        !searchValue ||
                        String(invoice.id)
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        String(invoice.driver)
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        String(invoice.company)
                            .toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        String(
                            invoice.createdByUserName
                        )
                            .toLowerCase()
                            .includes(
                                searchValue
                            );

                    const matchesCompany =
                        !company ||
                        invoice.company ===
                        company;

                    const matchesDriver =
                        !driver ||
                        invoice.driver ===
                        driver;

                    const matchesDate =
                        !selectedDate ||
                        invoice.date ===
                        selectedDate;

                    return (
                        matchesSearch &&
                        matchesCompany &&
                        matchesDriver &&
                        matchesDate
                    );
                }
            );
        }, [
            invoices,
            search,
            company,
            driver,
            date,
        ]);

    /* =========================
       Clear Filters
    ========================= */

    function clearFilters() {
        setSearch("");
        setCompany("");
        setDriver("");
        setDate("");
    }

    const hasFilters =
        search ||
        company ||
        driver ||
        date;

    /* =========================
       Open Preview
    ========================= */

    function openPreview(invoice) {
        console.log(
            "LIST INVOICE:",
            invoice
        );

        console.log(
            "LIST MONGO ID:",
            invoice?.mongoId
        );

        console.log(
            "LIST CREATOR:",
            invoice?.createdByUserName
        );

        console.log(
            "RAW INVOICE:",
            invoice?.raw
        );

        const previewInvoice =
            makePreviewInvoice(
                invoice?.raw
            );

        console.log(
            "PREVIEW INVOICE:",
            previewInvoice
        );

        console.log(
            "PREVIEW MONGO ID:",
            previewInvoice?._id
        );

        console.log(
            "PREVIEW CREATOR:",
            previewInvoice?.createdByUserName
        );

        setSelectedInvoice(
            previewInvoice
        );
    }

    /* =========================
       Close Preview
    ========================= */

    function closePreview() {
        setSelectedInvoice(null);
    }

    /* =========================
       JSX
    ========================= */

    return (
        <main className="main-content">

            {/* =========================
                Page Header
            ========================= */}

            <div className="page-heading invoice-page-heading">

                <div>

                    <h1>
                        فاکتورها
                    </h1>

                    <p>
                        مدیریت و مشاهده فاکتورهای ثبت‌شده
                    </p>

                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                    }}
                >

                    {/* ثبت فاکتور جدید */}

                    <a
                        href="/invoices/add"
                        className="invoice-add-button"
                    >

                        <Plus size={20} />

                        <span>
                            ثبت فاکتور جدید
                        </span>

                    </a>

                </div>

            </div>

            {/* =========================
                Filters
            ========================= */}

            <section className="invoice-filter-card">

                <div className="invoice-filter-header">

                    <div className="invoice-filter-title">

                        <Search size={19} />

                        <div>

                            <h2>
                                جستجو و فیلتر فاکتورها
                            </h2>

                            <span>
                                فاکتور مورد نظر خود را پیدا کنید
                            </span>

                        </div>

                    </div>

                    {hasFilters && (

                        <button
                            type="button"
                            className="invoice-clear-filter"
                            onClick={
                                clearFilters
                            }
                        >

                            <X size={16} />

                            پاک کردن فیلترها

                        </button>

                    )}

                </div>

                <div className="invoice-filter-grid">

                    {/* =========================
                        Search
                    ========================= */}

                    <div className="invoice-filter-field invoice-search-field">

                        <label>
                            جستجو
                        </label>

                        <div className="invoice-input-with-icon">

                            <Search size={17} />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="شماره فاکتور، راننده، شرکت یا ثبت‌کننده..."
                            />

                        </div>

                    </div>

                    {/* =========================
                        Company
                    ========================= */}

                    <div className="invoice-filter-field">

                        <label>
                            شرکت
                        </label>

                        <div className="invoice-select-wrapper">

                            <select
                                value={company}
                                onChange={(event) =>
                                    setCompany(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    همه شرکت‌ها
                                </option>

                                {companies.map(
                                    (item) => (

                                        <option
                                            value={item}
                                            key={item}
                                        >
                                            {item}
                                        </option>

                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={17}
                            />

                        </div>

                    </div>

                    {/* =========================
                        Driver
                    ========================= */}

                    <div className="invoice-filter-field">

                        <label>
                            راننده
                        </label>

                        <div className="invoice-select-wrapper">

                            <select
                                value={driver}
                                onChange={(event) =>
                                    setDriver(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    همه رانندگان
                                </option>

                                {drivers.map(
                                    (item) => (

                                        <option
                                            value={item}
                                            key={item}
                                        >
                                            {item}
                                        </option>

                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={17}
                            />

                        </div>

                    </div>

                    {/* =========================
                        Date
                    ========================= */}

                    <div className="invoice-filter-field">

                        <label>
                            تاریخ
                        </label>

                        <div className="invoice-input-with-icon invoice-date-filter-wrapper">

                            <CalendarDays
                                size={17}
                            />

                            <PersianDatePicker
                                value={date}
                                onChange={(value) =>
                                    setDate(
                                        value || ""
                                    )
                                }
                                placeholder="تاریخ فاکتور را انتخاب کنید"
                            />

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================
                Invoice List
            ========================= */}

            <section className="invoice-list-card">

                <div className="invoice-list-header">

                    <div>

                        <h2>
                            لیست فاکتورها
                        </h2>

                        <span>
                            {filteredInvoices.length} فاکتور
                        </span>

                    </div>

                </div>

                {/* =========================
                    Loading
                ========================= */}

                {loading ? (

                    <div className="invoice-empty">

                        <FileText
                            size={42}
                        />

                        <h3>
                            در حال دریافت فاکتورها...
                        </h3>

                    </div>

                ) : error ? (

                    /* =========================
                       Error
                    ========================= */

                    <div className="invoice-empty">

                        <FileText
                            size={42}
                        />

                        <h3>
                            خطا در دریافت اطلاعات
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>

                ) : filteredInvoices.length > 0 ? (

                    /* =========================
                       Table
                    ========================= */

                    <div className="invoice-table-wrapper">

                        <table className="invoice-table">

                            <thead>

                                <tr>

                                    <th>
                                        شماره فاکتور
                                    </th>

                                    <th>
                                        تاریخ
                                    </th>

                                    <th>
                                        راننده
                                    </th>

                                    <th>
                                        شرکت
                                    </th>

                                    <th>
                                        ثبت‌کننده
                                    </th>

                                    <th>
                                        مسیر
                                    </th>

                                    <th>
                                        مبلغ
                                    </th>

                                    <th>
                                        عملیات
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredInvoices.map(
                                    (invoice) => (

                                        <tr
                                            key={
                                                invoice.mongoId ||
                                                invoice.id
                                            }
                                        >

                                            {/* شماره فاکتور */}

                                            <td>

                                                <strong className="invoice-number">

                                                    {
                                                        invoice.id
                                                    }

                                                </strong>

                                            </td>

                                            {/* تاریخ */}

                                            <td>

                                                {
                                                    invoice.date
                                                }

                                            </td>

                                            {/* راننده */}

                                            <td>

                                                <span className="invoice-driver">

                                                    {
                                                        invoice.driver
                                                    }

                                                </span>

                                            </td>

                                            {/* شرکت */}

                                            <td>

                                                {
                                                    invoice.company
                                                }

                                            </td>

                                            {/* ثبت‌کننده */}

                                            <td>

                                                <span className="invoice-creator-list">

                                                    {
                                                        invoice.createdByUserName
                                                    }

                                                </span>

                                            </td>

                                            {/* مسیر */}

                                            <td>

                                                <div className="invoice-route">

                                                    <span>
                                                        {
                                                            invoice.origin
                                                        }
                                                    </span>

                                                    <span className="invoice-route-arrow">
                                                        ←
                                                    </span>

                                                    <span>
                                                        {
                                                            invoice.destination
                                                        }
                                                    </span>

                                                </div>

                                            </td>

                                            {/* مبلغ */}

                                            <td>

                                                <strong className="invoice-amount">

                                                    {
                                                        invoice.amount
                                                    }

                                                    <small>
                                                        {" "}
                                                        تومان
                                                    </small>

                                                </strong>

                                            </td>

                                            {/* عملیات */}

                                            <td>

                                                <div className="invoice-actions">

                                                    <button
                                                        type="button"
                                                        className="invoice-print-button"
                                                        title="مشاهده فاکتور"
                                                        aria-label="مشاهده فاکتور"
                                                        onClick={() =>
                                                            openPreview(
                                                                invoice
                                                            )
                                                        }
                                                    >

                                                        <Eye
                                                            size={18}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    /* =========================
                       Empty
                    ========================= */

                    <div className="invoice-empty">

                        <FileText
                            size={42}
                        />

                        <h3>
                            فاکتوری پیدا نشد
                        </h3>

                        <p>
                            فیلترها را تغییر دهید یا فاکتور جدید ثبت کنید.
                        </p>

                    </div>

                )}

            </section>

            {/* =========================
                Preview
            ========================= */}

            {selectedInvoice && (

                <InvoicePreview
                    invoice={
                        selectedInvoice
                    }
                    onClose={
                        closePreview
                    }
                />

            )}

        </main>
    );
}