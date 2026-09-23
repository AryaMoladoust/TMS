"use client";

import {
    FileText,
    Plus,
    Search,
    Printer,
    X,
    CalendarDays,
    ChevronDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function toPersianDigits(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(/\d/g, (digit) =>
        "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}

function toEnglishDigits(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(/[۰-۹]/g, (digit) =>
        "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
    );
}

function formatAmount(value) {
    const number = Number(value) || 0;

    return toPersianDigits(
        number.toLocaleString("en-US")
    );
}

function normalizeInvoice(invoice) {
    return {
        id:
            invoice.invoiceNumber ||
            invoice.invoiceId ||
            invoice._id ||
            "",

        date: invoice.date || "",

        driver:
            invoice.driverName ||
            invoice.dailyDriverId?.name ||
            invoice.driverId?.name ||
            "",

        company:
            invoice.companyName ||
            invoice.companyId?.name ||
            "",

        origin: invoice.origin || "",

        destination: invoice.destination || "",

        amount: formatAmount(invoice.cost),

        raw: invoice,
    };
}

export default function InvoicesPage() {
    const [search, setSearch] = useState("");
    const [company, setCompany] = useState("");
    const [driver, setDriver] = useState("");
    const [date, setDate] = useState("");

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "خطا در دریافت فاکتورها"
                    );
                }

                const invoiceList = Array.isArray(result)
                    ? result
                    : Array.isArray(result.invoices)
                        ? result.invoices
                        : [];

                setInvoices(
                    invoiceList.map(normalizeInvoice)
                );
            } catch (error) {
                console.error(
                    "Fetch invoices error:",
                    error
                );

                setError(
                    error.message ||
                    "خطا در دریافت فاکتورها"
                );

                setInvoices([]);
            } finally {
                setLoading(false);
            }
        }

        fetchInvoices();
    }, []);

    const companies = useMemo(() => {
        return [
            ...new Set(
                invoices
                    .map((invoice) => invoice.company)
                    .filter(Boolean)
            ),
        ];
    }, [invoices]);

    const drivers = useMemo(() => {
        return [
            ...new Set(
                invoices
                    .map((invoice) => invoice.driver)
                    .filter(Boolean)
            ),
        ];
    }, [invoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter((invoice) => {
            const searchValue = toEnglishDigits(
                search.trim().toLowerCase()
            );

            const invoiceId = toEnglishDigits(
                invoice.id.toLowerCase()
            );

            const driverName =
                invoice.driver.toLowerCase();

            const companyName =
                invoice.company.toLowerCase();

            const matchesSearch =
                !searchValue ||
                invoiceId.includes(searchValue) ||
                driverName.includes(searchValue) ||
                companyName.includes(searchValue);

            const matchesCompany =
                !company ||
                invoice.company === company;

            const matchesDriver =
                !driver ||
                invoice.driver === driver;

            const normalizedDate = toEnglishDigits(
                invoice.date
            );

            const normalizedSearchDate =
                toEnglishDigits(date.trim());

            const matchesDate =
                !normalizedSearchDate ||
                normalizedDate === normalizedSearchDate;

            return (
                matchesSearch &&
                matchesCompany &&
                matchesDriver &&
                matchesDate
            );
        });
    }, [
        invoices,
        search,
        company,
        driver,
        date,
    ]);

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

    return (
        <main className="main-content">

            {/* عنوان صفحه */}

            <div className="page-heading invoice-page-heading">

                <div>
                    <h1>فاکتورها</h1>

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


            {/* فیلترها */}

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

                    {/* جستجو */}

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


                    {/* شرکت */}

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

                                {companies.map((item) => (
                                    <option
                                        value={item}
                                        key={item}
                                    >
                                        {item}
                                    </option>
                                ))}

                            </select>

                            <ChevronDown size={17} />

                        </div>

                    </div>


                    {/* راننده */}

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

                                {drivers.map((item) => (
                                    <option
                                        value={item}
                                        key={item}
                                    >
                                        {item}
                                    </option>
                                ))}

                            </select>

                            <ChevronDown size={17} />

                        </div>

                    </div>


                    {/* تاریخ */}

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


            {/* لیست فاکتورها */}

            <section className="invoice-list-card">

                <div className="invoice-list-header">

                    <div>

                        <h2>
                            لیست فاکتورها
                        </h2>

                        <span>
                            {loading
                                ? "در حال دریافت..."
                                : `${toPersianDigits(
                                    filteredInvoices.length
                                )} فاکتور`}
                        </span>

                    </div>

                </div>


                {loading ? (

                    <div className="invoice-empty">

                        <FileText size={42} />

                        <h3>
                            در حال دریافت فاکتورها
                        </h3>

                        <p>
                            اطلاعات فاکتورها از دیتابیس دریافت می‌شود.
                        </p>

                    </div>

                ) : error ? (

                    <div className="invoice-empty">

                        <FileText size={42} />

                        <h3>
                            خطا در دریافت فاکتورها
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
                                    <th>شماره فاکتور</th>
                                    <th>تاریخ</th>
                                    <th>راننده</th>
                                    <th>شرکت</th>
                                    <th>مسیر</th>
                                    <th>مبلغ</th>
                                    <th>عملیات</th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredInvoices.map((invoice) => (

                                    <tr key={invoice.raw?._id || invoice.id}>

                                        <td>

                                            <strong className="invoice-number">
                                                {toPersianDigits(
                                                    invoice.id
                                                )}
                                            </strong>

                                        </td>

                                        <td>
                                            {toPersianDigits(
                                                invoice.date
                                            )}
                                        </td>

                                        <td>

                                            <span className="invoice-driver">
                                                {invoice.driver || "-"}
                                            </span>

                                        </td>

                                        <td>
                                            {invoice.company || "-"}
                                        </td>

                                        <td>

                                            <div className="invoice-route">

                                                <span>
                                                    {invoice.origin || "-"}
                                                </span>

                                                <span className="invoice-route-arrow">
                                                    ←
                                                </span>

                                                <span>
                                                    {invoice.destination || "-"}
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
                                                    title="چاپ فاکتور"
                                                    aria-label="چاپ فاکتور"
                                                    onClick={() => {
                                                        window.print();
                                                    }}
                                                >
                                                    <Printer size={18} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

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

        </main>
    );
}