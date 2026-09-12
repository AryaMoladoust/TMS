"use client";

import {
    Package,
    UserCheck,
    Clock3,
    FileWarning,
    Truck,
    MapPin,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

const pendingLoads = [
    {
        id: "LD-1001",
        title: "بار مواد غذایی",
        company: "شرکت بهار",
        origin: "تهران",
        destination: "رشت",
        date: "۱۴۰۵/۰۶/۲۱",
        vehicleType: "تریلی",
    },
    {
        id: "LD-1002",
        title: "بار قطعات صنعتی",
        company: "صنایع پارس",
        origin: "اصفهان",
        destination: "تهران",
        date: "۱۴۰۵/۰۶/۲۱",
        vehicleType: "کامیون",
    },
    {
        id: "LD-1003",
        title: "بار لوازم خانگی",
        company: "شرکت آریا",
        origin: "رشت",
        destination: "تبریز",
        date: "۱۴۰۵/۰۶/۲۱",
        vehicleType: "کامیونت",
    },
    {
        id: "LD-1004",
        title: "بار مصالح ساختمانی",
        company: "پارس سازه",
        origin: "قم",
        destination: "شیراز",
        date: "۱۴۰۵/۰۶/۲۱",
        vehicleType: "تریلی",
    },
];

const dailyDrivers = [
    {
        id: "DRV-1001",
        name: "علی رضایی",
        phone: "۰۹۱۲۱۲۳۴۵۶۷",
        vehicleType: "کامیون",
        entryType: "اصلی",
    },
    {
        id: "DRV-1002",
        name: "محمد کریمی",
        phone: "۰۹۱۳۱۲۳۴۵۶۷",
        vehicleType: "تریلی",
        entryType: "اصلی",
    },
    {
        id: "DRV-1003",
        name: "رضا احمدی",
        phone: "۰۹۱۱۱۲۳۴۵۶۷",
        vehicleType: "کامیونت",
        entryType: "اصلی",
    },
    {
        id: "GUEST-001",
        name: "حسین مرادی",
        phone: "۰۹۱۴۱۲۳۴۵۶۷",
        vehicleType: "وانت",
        entryType: "مهمان",
    },
];

export default function DisplayPage() {
    return (
        <main className="main-content display-page">
            <div className="display-page-header">
                <div>
                    <div className="display-title-row">
                        <div className="display-live-dot" />
                        <h1>مانیتورینگ</h1>
                    </div>

                    <p>
                        وضعیت بارهای بدون فاکتور و رانندگان ثبت‌شده امروز
                    </p>
                </div>

                <div className="display-date">
                    <CalendarDays size={18} />
                    <div>
                        <span>امروز</span>
                        <strong>۱۴۰۵/۰۶/۲۱</strong>
                    </div>
                </div>
            </div>

            <div className="display-stats">
                <div className="display-stat">
                    <div className="display-stat-icon display-stat-orange">
                        <FileWarning size={21} />
                    </div>

                    <div>
                        <span>بارهای بدون فاکتور</span>
                        <strong>{pendingLoads.length}</strong>
                    </div>
                </div>

                <div className="display-stat">
                    <div className="display-stat-icon display-stat-blue">
                        <UserCheck size={21} />
                    </div>

                    <div>
                        <span>رانندگان امروز</span>
                        <strong>{dailyDrivers.length}</strong>
                    </div>
                </div>

                <div className="display-stat">
                    <div className="display-stat-icon display-stat-green">
                        <Clock3 size={21} />
                    </div>

                    <div>
                        <span>وضعیت سیستم</span>
                        <strong>فعال</strong>
                    </div>
                </div>
            </div>

            <div className="display-grid">

                {/* بارهای بدون فاکتور */}
                <section className="display-panel">

                    <div className="display-panel-header">
                        <div className="display-panel-title">
                            <div className="display-panel-icon display-panel-orange">
                                <Package size={21} />
                            </div>

                            <div>
                                <h2>بارهای بدون فاکتور</h2>
                                <p>
                                    بارهایی که هنوز برای آن‌ها فاکتور ثبت نشده است
                                </p>
                            </div>
                        </div>

                        <span className="display-count orange">
                            {pendingLoads.length} بار
                        </span>
                    </div>

                    <div className="display-list">

                        {pendingLoads.map((load) => (
                            <div className="display-load-item" key={load.id}>

                                <div className="display-item-main">

                                    <div className="display-item-icon load">
                                        <Package size={19} />
                                    </div>

                                    <div className="display-item-info">

                                        <div className="display-item-title">
                                            <strong>{load.title}</strong>
                                            <span>{load.id}</span>
                                        </div>

                                        <span className="display-company">
                                            {load.company}
                                        </span>

                                        <div className="display-route">
                                            <span>{load.origin}</span>

                                            <span className="route-arrow">←</span>

                                            <span>{load.destination}</span>
                                        </div>

                                    </div>

                                </div>

                                <div className="display-load-meta">

                                    <div>
                                        <Truck size={15} />
                                        <span>{load.vehicleType}</span>
                                    </div>

                                    <div>
                                        <CalendarDays size={15} />
                                        <span>{load.date}</span>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                    {pendingLoads.length === 0 && (
                        <div className="display-empty">
                            <Package size={30} />
                            <strong>بار بدون فاکتور وجود ندارد</strong>
                            <span>همه بارها دارای فاکتور هستند.</span>
                        </div>
                    )}

                </section>


                {/* رانندگان امروز */}
                <section className="display-panel">

                    <div className="display-panel-header">

                        <div className="display-panel-title">

                            <div className="display-panel-icon display-panel-blue">
                                <UserCheck size={21} />
                            </div>

                            <div>
                                <h2>رانندگان امروز</h2>
                                <p>
                                    رانندگان ثبت‌شده در ورود روزانه امروز
                                </p>
                            </div>

                        </div>

                        <span className="display-count blue">
                            {dailyDrivers.length} راننده
                        </span>

                    </div>

                    <div className="display-list">

                        {dailyDrivers.map((driver) => (
                            <div className="display-driver-item" key={driver.id}>

                                <div className="display-driver-main">

                                    <div className="display-driver-avatar">
                                        <UserCheck size={18} />
                                    </div>

                                    <div className="display-driver-info">

                                        <div className="display-driver-name">
                                            <strong>{driver.name}</strong>

                                            <span
                                                className={
                                                    driver.entryType === "مهمان"
                                                        ? "display-driver-badge guest"
                                                        : "display-driver-badge"
                                                }
                                            >
                                                {driver.entryType}
                                            </span>
                                        </div>

                                        <span className="display-driver-phone">
                                            {driver.phone}
                                        </span>

                                    </div>

                                </div>

                                <div className="display-driver-vehicle">
                                    <Truck size={16} />
                                    <span>{driver.vehicleType}</span>
                                </div>

                            </div>
                        ))}

                    </div>

                    {dailyDrivers.length === 0 && (
                        <div className="display-empty">
                            <UserCheck size={30} />
                            <strong>امروز راننده‌ای ثبت نشده</strong>
                            <span>
                                از بخش ورود روزانه رانندگان، راننده ثبت کنید.
                            </span>
                        </div>
                    )}

                </section>

            </div>

            <div className="display-footer">
                <div>
                    <div className="display-live-dot" />
                    <span>مانیتورینگ فعال است</span>
                </div>

                <span>
                    آخرین بروزرسانی: همین لحظه
                </span>

                <RefreshCw size={16} />
            </div>

        </main>
    );
}