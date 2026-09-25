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

import InvoicePreview from "@/components/invoices/InvoicePreview";


/* =========================================================
   HELPERS
========================================================= */

function toPersianDigits(value) {
    if (value === null || value === undefined) return "";

    return String(value).replace(
        /\d/g,
        (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}


function formatAmount(value) {
    const number = Number(value) || 0;

    return toPersianDigits(
        number.toLocaleString("en-US")
    );
}


/* =========================================================
   NORMALIZE LIST INVOICE
========================================================= */

function normalizeInvoice(invoice) {
    const driver =
        invoice.driverName ||
        invoice.dailyDriverId?.name ||
        invoice.driverId?.name ||
        "—";

    const company =
        invoice.companyName ||
        invoice.companyId?.name ||
        "—";

    return {
        id:
            invoice.invoiceNumber ||
            invoice.invoiceId ||
            invoice._id ||
            "",

        mongoId:
            invoice._id || "",

        date:
            invoice.date || "—",

        driver,

        company,

        origin:
            invoice.origin || "—",

        destination:
            invoice.destination || "—",

        amount:
            formatAmount(invoice.cost),

        raw: invoice,
    };
}


/* =========================================================
   PREVIEW ADAPTER
========================================================= */

function makePreviewInvoice(invoice) {
    if (!invoice) return null;

    const companyData =
        invoice.companyId &&
        typeof invoice.companyId === "object"
            ? invoice.companyId
            : {};

    const driverData =
        invoice.driverId &&
        typeof invoice.driverId === "object"
            ? invoice.driverId
            : {};

    const mainCost =
        Number(invoice.cost) || 0;

    const insurance =
        Number(invoice.insuranceCost) || 0;

    const workerCost =
        Number(invoice.workerCost) || 0;

    const scaleCost =
        Number(invoice.scaleCost) || 0;

    const stopCost =
        Number(invoice.stopCost) || 0;

    const commissionCost =
        Number(invoice.commissionCost) || 0;

    const total =
        mainCost +
        insurance +
        workerCost +
        scaleCost +
        stopCost +
        commissionCost;


    return {
        /* =========================
           COMPANY
        ========================= */

        companyName:
            companyData.name ||
            invoice.companyName ||
            "—",

        companyManager:
            companyData.manager ||
            companyData.managerName ||
            "",

        companyMobile:
            companyData.mobile ||
            companyData.mobileNumber ||
            "",

        companyPhone:
            companyData.phone ||
            companyData.phoneNumber ||
            "",


        /* =========================
           INVOICE
        ========================= */

        number:
            invoice.invoiceNumber ||
            invoice.invoiceId ||
            "—",

        date:
            invoice.date || "—",

        startTime:
            invoice.startTime || "—",


        /* =========================
           DRIVER
        ========================= */

        driver:
            invoice.driverName ||
            driverData.name ||
            invoice.dailyDriverId?.name ||
            "—",

        vehicle:
            invoice.vehicleType ||
            driverData.vehicleType ||
            "—",

        plate:
            invoice.vehiclePlate ||
            driverData.plate ||
            "—",


        /* =========================
           LOAD SNAPSHOT
        ========================= */

        clientCompanyName:
            invoice.companyName ||
            companyData.name ||
            "—",

        cargoType:
            invoice.loadType ||
            "—",

        origin:
            invoice.origin ||
            "—",

        destination:
            invoice.destination ||
            "—",

        distance:
            invoice.distance
                ? `${toPersianDigits(invoice.distance)} کیلومتر`
                : "—",

        loadAddress:
            invoice.address ||
            "—",


        /* =========================
           COST
        ========================= */

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

        total:
            formatAmount(total),

        totalInWords:
            invoice.totalInWords ||
            "—",


        /* =========================
           OTHER
        ========================= */

        receiverName:
            invoice.receiverName ||
            "—",

        description:
            invoice.description ||
            "",
    };
}


/* =========================================================
   PAGE
========================================================= */

export default function InvoicesPage() {

    const [search, setSearch] = useState("");

    const [company, setCompany] = useState("");

    const [driver, setDriver] = useState("");

    const [date, setDate] = useState("");

    const [invoices, setInvoices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [selectedInvoice, setSelectedInvoice] =
        useState(null);


    /* =======================================================
       FETCH INVOICES
    ======================================================= */

    useEffect(() => {

        let cancelled = false;


        async function fetchInvoices() {

            try {

                setLoading(true);

                setError("");


                const response = await fetch(
                    "/api/invoices",
                    {
                        cache: "no-store",
                    }
                );


                if (!response.ok) {

                    throw new Error(
                        "دریافت فاکتورها ناموفق بود."
                    );
                }


                const result =
                    await response.json();


                const invoiceList =
                    Array.isArray(result)
                        ? result
                        : result.invoices || [];


                if (!cancelled) {

                    setInvoices(
                        invoiceList.map(
                            normalizeInvoice
                        )
                    );
                }

            } catch (error) {

                console.error(
                    "Fetch invoices error:",
                    error
                );


                if (!cancelled) {

                    setError(
                        error.message ||
                        "خطا در دریافت فاکتورها."
                    );

                    setInvoices([]);
                }

            } finally {

                if (!cancelled) {

                    setLoading(false);
                }
            }
        }


        fetchInvoices();


        return () => {

            cancelled = true;
        };

    }, []);


    /* =======================================================
       FILTER OPTIONS
    ======================================================= */

    const companies = useMemo(() => {

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


    const drivers = useMemo(() => {

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


    /* =======================================================
       FILTER
    ======================================================= */

    const filteredInvoices =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            return invoices.filter(
                (invoice) => {

                    const matchesSearch =
                        !searchValue ||
                        String(invoice.id)
                            .toLowerCase()
                            .includes(searchValue) ||
                        String(invoice.driver)
                            .toLowerCase()
                            .includes(searchValue) ||
                        String(invoice.company)
                            .toLowerCase()
                            .includes(searchValue);


                    const matchesCompany =
                        !company ||
                        invoice.company === company;


                    const matchesDriver =
                        !driver ||
                        invoice.driver === driver;


                    const matchesDate =
                        !date ||
                        invoice.date === date;


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


    /* =======================================================
       CLEAR FILTERS
    ======================================================= */

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


    /* =======================================================
       OPEN PREVIEW
    ======================================================= */

    function openPreview(invoice) {

        const previewInvoice =
            makePreviewInvoice(
                invoice.raw
            );


        setSelectedInvoice(
            previewInvoice
        );
    }


    /* =======================================================
       CLOSE PREVIEW
    ======================================================= */

    function closePreview() {

        setSelectedInvoice(null);
    }


    /* =======================================================
       RENDER
    ======================================================= */

    return (

        <main className="main-content">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-heading invoice-page-heading">

                <div>

                    <h1>
                        فاکتورها
                    </h1>

                    <p>
                        مدیریت و مشاهده فاکتورهای ثبت‌شده
                    </p>

                </div>


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


            {/* =================================================
                FILTERS
            ================================================= */}

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
                            onClick={clearFilters}
                        >

                            <X size={16} />

                            پاک کردن فیلترها

                        </button>

                    )}

                </div>


                <div className="invoice-filter-grid">

                    {/* SEARCH */}

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
                                placeholder="شماره فاکتور، راننده یا شرکت..."
                            />

                        </div>

                    </div>


                    {/* COMPANY */}

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

                            <ChevronDown size={17} />

                        </div>

                    </div>


                    {/* DRIVER */}

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

                            <ChevronDown size={17} />

                        </div>

                    </div>


                    {/* DATE */}

                    <div className="invoice-filter-field">

                        <label>
                            تاریخ
                        </label>

                        <div className="invoice-input-with-icon">

                            <CalendarDays size={17} />

                            <input
                                type="text"
                                value={date}
                                onChange={(event) =>
                                    setDate(
                                        event.target.value
                                    )
                                }
                                placeholder="مثلاً ۱۴۰۵/۰۶/۲۱"
                            />

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                INVOICE LIST
            ================================================= */}

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


                {loading ? (

                    <div className="invoice-empty">

                        <FileText size={42} />

                        <h3>
                            در حال دریافت فاکتورها...
                        </h3>

                    </div>

                ) : error ? (

                    <div className="invoice-empty">

                        <FileText size={42} />

                        <h3>
                            خطا در دریافت اطلاعات
                        </h3>

                        <p>
                            {error}
                        </p>

                    </div>

                ) : filteredInvoices.length > 0 ? (

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

                                            <td>

                                                <strong className="invoice-number">

                                                    {invoice.id}

                                                </strong>

                                            </td>


                                            <td>
                                                {invoice.date}
                                            </td>


                                            <td>

                                                <span className="invoice-driver">

                                                    {invoice.driver}

                                                </span>

                                            </td>


                                            <td>
                                                {invoice.company}
                                            </td>


                                            <td>

                                                <div className="invoice-route">

                                                    <span>
                                                        {invoice.origin}
                                                    </span>

                                                    <span className="invoice-route-arrow">
                                                        ←
                                                    </span>

                                                    <span>
                                                        {invoice.destination}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <strong className="invoice-amount">

                                                    {invoice.amount}

                                                    <small>
                                                        {" "}تومان
                                                    </small>

                                                </strong>

                                            </td>


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

                                                        <Eye size={18} />

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

                    <div className="invoice-empty">

                        <FileText size={42} />

                        <h3>
                            فاکتوری پیدا نشد
                        </h3>

                        <p>
                            فیلترها را تغییر دهید یا فاکتور جدید ثبت کنید.
                        </p>

                    </div>

                )}

            </section>


            {/* =================================================
                PREVIEW OVERLAY
            ================================================= */}

            {selectedInvoice && (

                <InvoicePreview
                    invoice={selectedInvoice}
                    onClose={closePreview}
                />

            )}

        </main>
    );
}