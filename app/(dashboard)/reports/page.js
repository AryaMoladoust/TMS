"use client";

import { useMemo, useState } from "react";
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
} from "lucide-react";

const reportData = [
    {
        id: "INV-1001",
        driver: "علی رضایی",
        vehicleType: "تریلی",
        company: "شرکت بهار",
        loadType: "مواد غذایی",
        origin: "تهران",
        destination: "رشت",
        distance: 320,
        paymentType: "اعتباری",
        cost: 18500000,
        date: "1405/06/21",
    },
    {
        id: "INV-1002",
        driver: "محمد کریمی",
        vehicleType: "کامیون",
        company: "صنایع پارس",
        loadType: "قطعات صنعتی",
        origin: "اصفهان",
        destination: "تهران",
        distance: 450,
        paymentType: "نقد",
        cost: 22000000,
        date: "1405/06/20",
    },
    {
        id: "INV-1003",
        driver: "رضا احمدی",
        vehicleType: "کامیونت",
        company: "شرکت آریا",
        loadType: "لوازم خانگی",
        origin: "رشت",
        destination: "تبریز",
        distance: 610,
        paymentType: "اعتباری",
        cost: 27500000,
        date: "1405/06/20",
    },
    {
        id: "INV-1004",
        driver: "علی رضایی",
        vehicleType: "تریلی",
        company: "پارس سازه",
        loadType: "مصالح ساختمانی",
        origin: "قم",
        destination: "شیراز",
        distance: 720,
        paymentType: "نقد",
        cost: 31000000,
        date: "1405/06/19",
    },
    {
        id: "INV-1005",
        driver: "حسین مرادی",
        vehicleType: "وانت",
        company: "شرکت بهار",
        loadType: "مواد غذایی",
        origin: "تهران",
        destination: "قم",
        distance: 150,
        paymentType: "نقد",
        cost: 8500000,
        date: "1405/06/18",
    },
    {
        id: "INV-1006",
        driver: "محمد کریمی",
        vehicleType: "کامیون",
        company: "صنایع پارس",
        loadType: "قطعات صنعتی",
        origin: "کرج",
        destination: "مشهد",
        distance: 890,
        paymentType: "اعتباری",
        cost: 39000000,
        date: "1405/06/17",
    },
];

const filterOptions = {
    drivers: [
        "همه رانندگان",
        "علی رضایی",
        "محمد کریمی",
        "رضا احمدی",
        "حسین مرادی",
    ],

    vehicles: [
        "همه ماشین‌ها",
        "تریلی",
        "کامیون",
        "کامیونت",
        "وانت",
    ],

    companies: [
        "همه شرکت‌ها",
        "شرکت بهار",
        "صنایع پارس",
        "شرکت آریا",
        "پارس سازه",
    ],

    loadTypes: [
        "همه انواع بار",
        "مواد غذایی",
        "قطعات صنعتی",
        "لوازم خانگی",
        "مصالح ساختمانی",
    ],

    origins: [
        "همه مبداها",
        "تهران",
        "اصفهان",
        "رشت",
        "قم",
        "کرج",
    ],

    destinations: [
        "همه مقصدها",
        "رشت",
        "تهران",
        "تبریز",
        "شیراز",
        "قم",
        "مشهد",
    ],

    payments: [
        "همه",
        "اعتباری",
        "نقد",
    ],
};

function formatNumber(number) {
    return new Intl.NumberFormat("fa-IR").format(number);
}

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
                    onChange={(e) => onChange(e.target.value)}
                >
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const [filters, setFilters] = useState({
        driver: "همه رانندگان",
        vehicle: "همه ماشین‌ها",
        company: "همه شرکت‌ها",
        loadType: "همه انواع بار",
        origin: "همه مبداها",
        destination: "همه مقصدها",
        payment: "همه",
        fromDate: "",
        toDate: "",
    });

    function updateFilter(field, value) {
        setFilters((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function resetFilters() {
        setFilters({
            driver: "همه رانندگان",
            vehicle: "همه ماشین‌ها",
            company: "همه شرکت‌ها",
            loadType: "همه انواع بار",
            origin: "همه مبداها",
            destination: "همه مقصدها",
            payment: "همه",
            fromDate: "",
            toDate: "",
        });
    }

    const filteredData = useMemo(() => {
        return reportData.filter((item) => {
            if (
                filters.driver !== "همه رانندگان" &&
                item.driver !== filters.driver
            ) {
                return false;
            }

            if (
                filters.vehicle !== "همه ماشین‌ها" &&
                item.vehicleType !== filters.vehicle
            ) {
                return false;
            }

            if (
                filters.company !== "همه شرکت‌ها" &&
                item.company !== filters.company
            ) {
                return false;
            }

            if (
                filters.loadType !== "همه انواع بار" &&
                item.loadType !== filters.loadType
            ) {
                return false;
            }

            if (
                filters.origin !== "همه مبداها" &&
                item.origin !== filters.origin
            ) {
                return false;
            }

            if (
                filters.destination !== "همه مقصدها" &&
                item.destination !== filters.destination
            ) {
                return false;
            }

            if (
                filters.payment !== "همه" &&
                item.paymentType !== filters.payment
            ) {
                return false;
            }

            return true;
        });
    }, [filters]);

    const totalDistance = filteredData.reduce(
        (sum, item) => sum + item.distance,
        0
    );

    const totalCost = filteredData.reduce(
        (sum, item) => sum + item.cost,
        0
    );

    const uniqueDrivers = new Set(
        filteredData.map((item) => item.driver)
    ).size;

    const uniqueCompanies = new Set(
        filteredData.map((item) => item.company)
    ).size;

    return (
        <main className="main-content reports-page">

            {/* Header */}
            <div className="reports-page-header">
                <div className="reports-heading">

                    <div className="reports-heading-icon">
                        <BarChart3 size={24} />
                    </div>

                    <div>
                        <h1>گزارشات</h1>

                        <p>
                            دریافت گزارش بر اساس اطلاعات ثبت‌شده در سیستم
                        </p>
                    </div>

                </div>
            </div>


            {/* Filters */}
            <section className="reports-filter-panel">

                <div className="reports-section-header">

                    <div className="reports-section-title">

                        <div className="reports-section-icon">
                            <ClipboardList size={19} />
                        </div>

                        <div>
                            <h2>فیلتر گزارش</h2>

                            <p>
                                اطلاعات مورد نظر برای گزارش را انتخاب کنید
                            </p>
                        </div>

                    </div>

                </div>


                <div className="reports-filter-grid">

                    <FilterSelect
                        icon={User}
                        label="راننده"
                        value={filters.driver}
                        onChange={(value) =>
                            updateFilter("driver", value)
                        }
                        options={filterOptions.drivers}
                    />


                    <FilterSelect
                        icon={Truck}
                        label="نوع ماشین"
                        value={filters.vehicle}
                        onChange={(value) =>
                            updateFilter("vehicle", value)
                        }
                        options={filterOptions.vehicles}
                    />


                    <FilterSelect
                        icon={Building2}
                        label="شرکت"
                        value={filters.company}
                        onChange={(value) =>
                            updateFilter("company", value)
                        }
                        options={filterOptions.companies}
                    />


                    <FilterSelect
                        icon={Package}
                        label="نوع بار"
                        value={filters.loadType}
                        onChange={(value) =>
                            updateFilter("loadType", value)
                        }
                        options={filterOptions.loadTypes}
                    />


                    <FilterSelect
                        icon={MapPin}
                        label="مبدا"
                        value={filters.origin}
                        onChange={(value) =>
                            updateFilter("origin", value)
                        }
                        options={filterOptions.origins}
                    />


                    <FilterSelect
                        icon={Navigation}
                        label="مقصد"
                        value={filters.destination}
                        onChange={(value) =>
                            updateFilter("destination", value)
                        }
                        options={filterOptions.destinations}
                    />


                    <FilterSelect
                        icon={CreditCard}
                        label="نوع پرداخت"
                        value={filters.payment}
                        onChange={(value) =>
                            updateFilter("payment", value)
                        }
                        options={filterOptions.payments}
                    />


                    {/* From date */}
                    <div className="report-filter-item">

                        <label>از تاریخ</label>

                        <div className="report-date-wrapper">

                            <CalendarDays size={17} />

                            <input
                                type="text"
                                placeholder="۱۴۰۵/۰۶/۰۱"
                                value={filters.fromDate}
                                onChange={(e) =>
                                    updateFilter("fromDate", e.target.value)
                                }
                            />

                        </div>

                    </div>


                    {/* To date */}
                    <div className="report-filter-item">

                        <label>تا تاریخ</label>

                        <div className="report-date-wrapper">

                            <CalendarDays size={17} />

                            <input
                                type="text"
                                placeholder="۱۴۰۵/۰۶/۳۱"
                                value={filters.toDate}
                                onChange={(e) =>
                                    updateFilter("toDate", e.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>


                <div className="reports-filter-actions">

                    <button
                        type="button"
                        className="reports-reset-button"
                        onClick={resetFilters}
                    >
                        <RotateCcw size={16} />
                        پاک کردن فیلترها
                    </button>


                    <button
                        type="button"
                        className="reports-generate-button"
                    >
                        <Search size={17} />
                        دریافت گزارش
                    </button>

                </div>

            </section>


            {/* Summary */}
            <section className="reports-summary">

                <div className="reports-summary-card">

                    <div className="reports-summary-icon blue">
                        <FileText size={20} />
                    </div>

                    <div>
                        <span>تعداد بار</span>

                        <strong>
                            {formatNumber(filteredData.length)}
                        </strong>
                    </div>

                </div>


                <div className="reports-summary-card">

                    <div className="reports-summary-icon orange">
                        <Route size={20} />
                    </div>

                    <div>
                        <span>مسافت کل</span>

                        <strong>
                            {formatNumber(totalDistance)} کیلومتر
                        </strong>
                    </div>

                </div>


                <div className="reports-summary-card">

                    <div className="reports-summary-icon green">
                        <Wallet size={20} />
                    </div>

                    <div>
                        <span>هزینه کل</span>

                        <strong>
                            {formatNumber(totalCost)} تومان
                        </strong>
                    </div>

                </div>


                <div className="reports-summary-card">

                    <div className="reports-summary-icon purple">
                        <Users size={20} />
                    </div>

                    <div>
                        <span>رانندگان</span>

                        <strong>
                            {formatNumber(uniqueDrivers)}
                        </strong>
                    </div>

                </div>


                <div className="reports-summary-card">

                    <div className="reports-summary-icon cyan">
                        <Building2 size={20} />
                    </div>

                    <div>
                        <span>شرکت‌ها</span>

                        <strong>
                            {formatNumber(uniqueCompanies)}
                        </strong>
                    </div>

                </div>

            </section>


            {/* Results */}
            <section className="reports-results">

                <div className="reports-results-header">

                    <div>

                        <h2>نتایج گزارش</h2>

                        <p>
                            {formatNumber(filteredData.length)} مورد مطابق فیلترهای انتخاب‌شده
                        </p>

                    </div>


                    <button
                        type="button"
                        className="reports-export-button"
                    >
                        <FileText size={16} />
                        خروجی گزارش
                    </button>

                </div>


                {filteredData.length > 0 ? (

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>
                                    <th>فاکتور</th>
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

                                {filteredData.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                                            <strong className="report-invoice-id">
                                                {item.id}
                                            </strong>
                                        </td>


                                        <td>
                                            <span className="report-driver-name">
                                                {item.driver}
                                            </span>
                                        </td>


                                        <td>
                                            {item.company}
                                        </td>


                                        <td>
                                            {item.loadType}
                                        </td>


                                        <td>

                                            <span className="report-vehicle">
                                                <Truck size={14} />
                                                {item.vehicleType}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="report-route-cell">
                                                <span>{item.origin}</span>

                                                <span>←</span>

                                                <span>{item.destination}</span>
                                            </div>

                                        </td>


                                        <td>
                                            {formatNumber(item.distance)} کیلومتر
                                        </td>


                                        <td>

                                            <strong className="report-cost">
                                                {formatNumber(item.cost)}
                                            </strong>

                                        </td>


                                        <td>
                                            {item.date}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="reports-empty">

                        <Search size={35} />

                        <strong>
                            گزارشی با این فیلترها پیدا نشد
                        </strong>

                        <span>
                            فیلترها را تغییر دهید و دوباره گزارش بگیرید.
                        </span>

                    </div>

                )}

            </section>

        </main>
    );
}