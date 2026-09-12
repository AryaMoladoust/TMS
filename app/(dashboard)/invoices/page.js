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
import { useMemo, useState } from "react";

const mockInvoices = [
    {
        id: "INV-1405-001",
        date: "۱۴۰۵/۰۶/۲۱",
        driver: "علی رضایی",
        company: "شرکت حمل‌ونقل البرز",
        origin: "تهران",
        destination: "رشت",
        amount: "۱۲,۵۰۰,۰۰۰",
    },
    {
        id: "INV-1405-002",
        date: "۱۴۰۵/۰۶/۲۱",
        driver: "محمد کریمی",
        company: "شرکت بازرگانی شمال",
        origin: "رشت",
        destination: "تهران",
        amount: "۹,۸۰۰,۰۰۰",
    },
    {
        id: "INV-1405-003",
        date: "۱۴۰۵/۰۶/۲۰",
        driver: "رضا احمدی",
        company: "شرکت حمل‌ونقل البرز",
        origin: "قزوین",
        destination: "تبریز",
        amount: "۱۵,۲۰۰,۰۰۰",
    },
    {
        id: "INV-1405-004",
        date: "۱۴۰۵/۰۶/۱۹",
        driver: "حسین محمدی",
        company: "شرکت بازرگانی شمال",
        origin: "تهران",
        destination: "ساری",
        amount: "۸,۶۰۰,۰۰۰",
    },
    {
        id: "INV-1405-005",
        date: "۱۴۰۵/۰۶/۱۸",
        driver: "امیر حسینی",
        company: "شرکت کاسپین",
        origin: "رشت",
        destination: "انزلی",
        amount: "۶,۴۰۰,۰۰۰",
    },
];

export default function InvoicesPage() {
    const [search, setSearch] = useState("");
    const [company, setCompany] = useState("");
    const [driver, setDriver] = useState("");
    const [date, setDate] = useState("");

    const companies = [
        ...new Set(
            mockInvoices.map((invoice) => invoice.company)
        ),
    ];

    const drivers = [
        ...new Set(
            mockInvoices.map((invoice) => invoice.driver)
        ),
    ];

    const filteredInvoices = useMemo(() => {
        return mockInvoices.filter((invoice) => {
            const searchValue = search
                .trim()
                .toLowerCase();

            const matchesSearch =
                !searchValue ||
                invoice.id
                    .toLowerCase()
                    .includes(searchValue) ||
                invoice.driver
                    .toLowerCase()
                    .includes(searchValue) ||
                invoice.company
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
        });
    }, [
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
                                    setSearch(event.target.value)
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
                                    setCompany(event.target.value)
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
                                    setDriver(event.target.value)
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
                                    setDate(event.target.value)
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
                            {filteredInvoices.length} فاکتور
                        </span>

                    </div>

                </div>


                {filteredInvoices.length > 0 ? (

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

                                    <tr key={invoice.id}>

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
                                                    title="چاپ فاکتور"
                                                    aria-label="چاپ فاکتور"
                                                    onClick={() => { }}
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