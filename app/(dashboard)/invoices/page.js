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

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import PersianDatePicker from "@/components/drivers/PersianDatePicker";
import InvoicePreview from "@/components/invoices/InvoicePreview";
import { useNotification } from "@/components/ui/NotificationProvider";

/* =========================
   Persian Digits
========================= */

function toPersianDigits(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).replace(
        /\d/g,
        (digit) =>
            "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}

/* =========================
   Format Amount
========================= */

function formatAmount(value) {
    const number =
        Number(value) || 0;

    return toPersianDigits(
        number.toLocaleString("en-US")
    );
}

/* =========================
   Normalize Invoice
========================= */

function normalizeInvoice(invoice) {
    const mongoId =
        invoice?._id
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
            formatAmount(
                invoice?.cost
            ),

        createdByUserName,

        raw: {
            ...invoice,
            _id: mongoId,
        },
    };
}

/* =========================
   Make Preview Invoice
========================= */

function makePreviewInvoice(
    invoice
) {
    if (!invoice) {
        return null;
    }

    const invoiceMongoId =
        invoice?._id
            ? String(invoice._id)
            : "";

    const companyData =
        invoice?.companyId &&
        typeof invoice.companyId ===
            "object"
            ? invoice.companyId
            : {};

    const driverData =
        invoice?.driverId &&
        typeof invoice.driverId ===
            "object"
            ? invoice.driverId
            : {};

    const mainCost =
        Number(invoice?.cost) || 0;

    const insurance =
        Number(
            invoice?.insuranceCost
        ) || 0;

    const workerCost =
        Number(
            invoice?.workerCost
        ) || 0;

    const scaleCost =
        Number(
            invoice?.scaleCost
        ) || 0;

    const stopCost =
        Number(
            invoice?.stopCost
        ) || 0;

    const commissionCost =
        Number(
            invoice?.commissionCost
        ) || 0;

    const total =
        mainCost +
        insurance +
        workerCost +
        scaleCost +
        stopCost +
        commissionCost;

    const createdByUserName =
        invoice?.createdByUserName ||
        invoice?.createdByUserId?.username ||
        invoice?.createdByUserId?.name ||
        "—";

    const createdByUserId =
        invoice?.createdByUserId?._id
            ? String(
                invoice.createdByUserId._id
            )
            : invoice?.createdByUserId
                ? String(
                    invoice.createdByUserId
                )
                : "";

    return {
        _id: invoiceMongoId,

        mongoId: invoiceMongoId,

        createdByUserName,

        createdByUserId,

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

        clientCompanyName:
            invoice?.companyName ||
            companyData?.name ||
            "—",

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

        cost:
            formatAmount(
                mainCost
            ),

        insurance:
            formatAmount(
                insurance
            ),

        workerCost:
            formatAmount(
                workerCost
            ),

        scaleCost:
            formatAmount(
                scaleCost
            ),

        stopCost:
            formatAmount(
                stopCost
            ),

        commissionCost:
            formatAmount(
                commissionCost
            ),

        total:
            formatAmount(total),

        totalInWords:
            invoice?.totalInWords ||
            "—",

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

    const {
        showError,
    } = useNotification();

    /* =========================
       Filters
    ========================= */

    const [search, setSearch] =
        useState("");

    const [company, setCompany] =
        useState("");

    const [driver, setDriver] =
        useState("");

    const [date, setDate] =
        useState("");

    /* =========================
       Data
    ========================= */

    const [invoices, setInvoices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        selectedInvoice,
        setSelectedInvoice,
    ] = useState(null);

    /* =========================
       Pagination
    ========================= */

    const [page, setPage] =
        useState(1);

    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    /* =========================
       Filter Options
    ========================= */

    const [
        filterOptions,
        setFilterOptions,
    ] = useState({
        companies: [],
        drivers: [],
    });

    /* =========================
       Fetch Invoices
    ========================= */

    useEffect(() => {

        let cancelled = false;

        let firstLoad = true;

        async function fetchInvoices({
            showLoading = false,
            showNotificationOnError = false,
        } = {}) {

            try {

                if (showLoading) {
                    setLoading(true);
                }

                const params =
                    new URLSearchParams();

                params.set(
                    "page",
                    String(page)
                );

                params.set(
                    "limit",
                    "50"
                );

                /* =========================
                   Search
                ========================= */

                if (
                    search.trim()
                ) {
                    params.set(
                        "search",
                        search.trim()
                    );
                }

                /* =========================
                   Company
                ========================= */

                if (company) {
                    params.set(
                        "company",
                        company
                    );
                }

                /* =========================
                   Driver
                ========================= */

                if (driver) {
                    params.set(
                        "driver",
                        driver
                    );
                }

                /* =========================
                   Date
                ========================= */

                const selectedDate =
                    date &&
                    typeof date.format ===
                        "function"
                        ? date.format(
                            "YYYY/MM/DD"
                        )
                        : date;

                if (selectedDate) {
                    params.set(
                        "date",
                        selectedDate
                    );
                }

                /* =========================
                   Request
                ========================= */

                const response =
                    await fetch(
                        `/api/invoices?${params.toString()}`,
                        {
                            cache:
                                "no-store",
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

                if (cancelled) {
                    return;
                }

                /* =========================
                   Invoice Data
                ========================= */

                const invoiceList =
                    Array.isArray(result)
                        ? result
                        : result?.invoices ||
                        [];

                const normalizedInvoices =
                    invoiceList.map(
                        normalizeInvoice
                    );

                setInvoices(
                    normalizedInvoices
                );

                /* =========================
                   Pagination
                ========================= */

                if (
                    result?.pagination
                ) {
                    setPagination(
                        result.pagination
                    );
                }

                /* =========================
                   Filter Options
                ========================= */

                if (
                    result?.filterOptions
                ) {
                    setFilterOptions(
                        {
                            companies:
                                result
                                    .filterOptions
                                    .companies ||
                                [],

                            drivers:
                                result
                                    .filterOptions
                                    .drivers ||
                                [],
                        }
                    );
                }

                setError("");

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

                if (firstLoad) {

                    setError(
                        error?.message ||
                        "خطا در دریافت فاکتورها."
                    );

                    setInvoices([]);

                    firstLoad = false;

                    setLoading(false);
                }

            }
        }

        /* =========================
           Initial / Filter Fetch
        ========================= */

        fetchInvoices({
            showLoading: true,
            showNotificationOnError: true,
        });

        /* =========================
           Polling
        ========================= */

        const pollingInterval =
            setInterval(() => {

                fetchInvoices({
                    showLoading: false,
                    showNotificationOnError: false,
                });

            }, 10000);

        /* =========================
           Sync Event
        ========================= */

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

        /* =========================
           Cleanup
        ========================= */

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

    }, [
        page,
        search,
        company,
        driver,
        date,
        showError,
    ]);

    /* =========================
       Filter Options
    ========================= */

    const companies =
        useMemo(() => {

            return (
                filterOptions.companies ||
                []
            );

        }, [
            filterOptions.companies,
        ]);

    const drivers =
        useMemo(() => {

            return (
                filterOptions.drivers ||
                []
            );

        }, [
            filterOptions.drivers,
        ]);

    /* =========================
       IMPORTANT
       Filtering is now SERVER-SIDE.
    ========================= */

    const filteredInvoices =
        invoices;

    /* =========================
       Clear Filters
    ========================= */

    function clearFilters() {

        setSearch("");

        setCompany("");

        setDriver("");

        setDate("");

        setPage(1);
    }

    const hasFilters =
        Boolean(
            search ||
            company ||
            driver ||
            date
        );

    /* =========================
       Search Change
    ========================= */

    function handleSearchChange(
        event
    ) {

        setSearch(
            event.target.value
        );

        setPage(1);
    }

    /* =========================
       Company Change
    ========================= */

    function handleCompanyChange(
        event
    ) {

        setCompany(
            event.target.value
        );

        setPage(1);
    }

    /* =========================
       Driver Change
    ========================= */

    function handleDriverChange(
        event
    ) {

        setDriver(
            event.target.value
        );

        setPage(1);
    }

    /* =========================
       Date Change
    ========================= */

    function handleDateChange(
        value
    ) {

        setDate(
            value || ""
        );

        setPage(1);
    }

    /* =========================
       Open Preview
    ========================= */

    function openPreview(
        invoice
    ) {

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
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "8px",
                        flexWrap:
                            "wrap",
                    }}
                >

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
                                onChange={
                                    handleSearchChange
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
                                value={
                                    company
                                }
                                onChange={
                                    handleCompanyChange
                                }
                            >

                                <option value="">
                                    همه شرکت‌ها
                                </option>

                                {companies.map(
                                    (item) => (

                                        <option
                                            value={
                                                item
                                            }
                                            key={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
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
                                value={
                                    driver
                                }
                                onChange={
                                    handleDriverChange
                                }
                            >

                                <option value="">
                                    همه رانندگان
                                </option>

                                {drivers.map(
                                    (item) => (

                                        <option
                                            value={
                                                item
                                            }
                                            key={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
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
                                value={
                                    date
                                }
                                onChange={
                                    handleDateChange
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
                            {Number(
                                pagination.total ||
                                0
                            ).toLocaleString(
                                "fa-IR"
                            )}{" "}
                            فاکتور
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
                                    (
                                        invoice
                                    ) => (

                                        <tr
                                            key={
                                                invoice.mongoId ||
                                                invoice.id
                                            }
                                        >

                                            <td>

                                                <strong className="invoice-number">

                                                    {
                                                        invoice.id
                                                    }

                                                </strong>

                                            </td>

                                            <td>

                                                {
                                                    invoice.date
                                                }

                                            </td>

                                            <td>

                                                <span className="invoice-driver">

                                                    {
                                                        invoice.driver
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {
                                                    invoice.company
                                                }

                                            </td>

                                            <td>

                                                <span className="invoice-creator-list">

                                                    {
                                                        invoice.createdByUserName
                                                    }

                                                </span>

                                            </td>

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

                {/* =========================
                    Pagination
                ========================= */}

                {!loading &&
                    !error &&
                    pagination.totalPages >
                        1 && (

                        <div className="drivers-pagination">

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasPreviousPage
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            previous
                                        ) =>
                                            Math.max(
                                                previous -
                                                    1,
                                                1
                                            )
                                    )
                                }
                            >
                                قبلی
                            </button>

                            <span>

                                صفحه{" "}

                                {Number(
                                    pagination.page
                                ).toLocaleString(
                                    "fa-IR"
                                )}

                                {" "}از{" "}

                                {Number(
                                    pagination.totalPages
                                ).toLocaleString(
                                    "fa-IR"
                                )}

                            </span>

                            <button
                                type="button"
                                disabled={
                                    !pagination.hasNextPage
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            previous
                                        ) =>
                                            previous +
                                            1
                                    )
                                }
                            >
                                بعدی
                            </button>

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