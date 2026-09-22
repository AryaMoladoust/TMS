"use client";

import {
    Package,
    UserCheck,
    Clock3,
    FileWarning,
    Truck,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";

function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatPersianDate() {
    const now = new Date();

    return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(now);
}

export default function DisplayPage() {

    /*
    |--------------------------------------------------------------------------
    | Daily Drivers
    |--------------------------------------------------------------------------
    */

    const [dailyDrivers, setDailyDrivers] = useState([]);

    const [driversLoading, setDriversLoading] = useState(true);

    const [lastUpdate, setLastUpdate] = useState(null);

    async function loadDailyDrivers() {
        try {
            const response = await fetch(
                `/api/daily-drivers?date=${getTodayKey()}`,
                {
                    cache: "no-store",
                }
            );

            if (!response.ok) {
                throw new Error("خطا در دریافت رانندگان");
            }

            const data = await response.json();

            const drivers =
                Array.isArray(data)
                    ? data
                    : data.dailyDrivers || [];

            setDailyDrivers(drivers);

            setLastUpdate(
                new Date().toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                })
            );

        } catch (error) {

            console.error(
                "Display daily drivers error:",
                error
            );

            setDailyDrivers([]);

        } finally {

            setDriversLoading(false);

        }
    }

    useEffect(() => {

        loadDailyDrivers();

        /*
        |----------------------------------------------------------------------
        | Auto Refresh
        |----------------------------------------------------------------------
        */

        const interval = setInterval(() => {
            loadDailyDrivers();
        }, 5000);

        /*
        |----------------------------------------------------------------------
        | Instant update when Daily Drivers changes
        |----------------------------------------------------------------------
        */

        function handleDailyDriversUpdated() {
            loadDailyDrivers();
        }

        window.addEventListener(
            "daily-drivers-updated",
            handleDailyDriversUpdated
        );

        return () => {

            clearInterval(interval);

            window.removeEventListener(
                "daily-drivers-updated",
                handleDailyDriversUpdated
            );

        };

    }, []);

    /*
    |--------------------------------------------------------------------------
    | فعلاً آمار بارها را دست نمی‌زنیم
    |--------------------------------------------------------------------------
    */

    const pendingLoads = [];

    return (

        <main className="main-content display-page">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="display-page-header">

                <div>

                    <div className="display-title-row">

                        <div className="display-live-dot" />

                        <h1>
                            مانیتورینگ
                        </h1>

                    </div>

                    <p>
                        وضعیت بارهای بدون فاکتور و رانندگان ثبت‌شده امروز
                    </p>

                </div>

                <div className="display-date">

                    <CalendarDays size={18} />

                    <div>

                        <span>
                            امروز
                        </span>

                        <strong>
                            {formatPersianDate()}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================================
                STATS
            ====================================================== */}

            <div className="display-stats">

                <div className="display-stat">

                    <div className="display-stat-icon display-stat-orange">

                        <FileWarning size={21} />

                    </div>

                    <div>

                        <span>
                            بارهای بدون فاکتور
                        </span>

                        <strong>
                            {pendingLoads.length}
                        </strong>

                    </div>

                </div>


                <div className="display-stat">

                    <div className="display-stat-icon display-stat-blue">

                        <UserCheck size={21} />

                    </div>

                    <div>

                        <span>
                            رانندگان امروز
                        </span>

                        <strong>
                            {dailyDrivers.length}
                        </strong>

                    </div>

                </div>


                <div className="display-stat">

                    <div className="display-stat-icon display-stat-green">

                        <Clock3 size={21} />

                    </div>

                    <div>

                        <span>
                            وضعیت سیستم
                        </span>

                        <strong>
                            فعال
                        </strong>

                    </div>

                </div>

            </div>


            {/* =====================================================
                GRID
            ====================================================== */}

            <div className="display-grid">


                {/* =================================================
                    LOADS
                ================================================== */}

                <section className="display-panel">

                    <div className="display-panel-header">

                        <div className="display-panel-title">

                            <div className="display-panel-icon display-panel-orange">

                                <Package size={21} />

                            </div>

                            <div>

                                <h2>
                                    بارهای بدون فاکتور
                                </h2>

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

                            <div
                                className="display-load-item"
                                key={load.id}
                            >

                                <div className="display-item-main">

                                    <div className="display-item-icon load">
                                        <Package size={19} />
                                    </div>

                                    <div className="display-item-info">

                                        <div className="display-item-title">

                                            <strong>
                                                {load.title}
                                            </strong>

                                            <span>
                                                {load.id}
                                            </span>

                                        </div>

                                        <span className="display-company">
                                            {load.company}
                                        </span>

                                        <div className="display-route">

                                            <span>
                                                {load.origin}
                                            </span>

                                            <span className="route-arrow">
                                                ←
                                            </span>

                                            <span>
                                                {load.destination}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                <div className="display-load-meta">

                                    <div>

                                        <Truck size={15} />

                                        <span>
                                            {load.vehicleType}
                                        </span>

                                    </div>

                                    <div>

                                        <CalendarDays size={15} />

                                        <span>
                                            {load.date}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>


                    {pendingLoads.length === 0 && (

                        <div className="display-empty">

                            <Package size={30} />

                            <strong>
                                فعلاً باری برای نمایش وجود ندارد
                            </strong>

                            <span>
                                بخش بارها بعداً به این قسمت متصل می‌شود.
                            </span>

                        </div>

                    )}

                </section>


                {/* =================================================
                    DAILY DRIVERS
                ================================================== */}

                <section className="display-panel">

                    <div className="display-panel-header">

                        <div className="display-panel-title">

                            <div className="display-panel-icon display-panel-blue">

                                <UserCheck size={21} />

                            </div>

                            <div>

                                <h2>
                                    رانندگان امروز
                                </h2>

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

                        {driversLoading ? (

                            <div className="display-empty">

                                <RefreshCw
                                    size={30}
                                    className="display-loading-icon"
                                />

                                <strong>
                                    در حال دریافت رانندگان...
                                </strong>

                            </div>

                        ) : dailyDrivers.map((driver) => (

                            <div
                                className="display-driver-item"
                                key={driver._id}
                            >

                                <div className="display-driver-main">

                                    <div className="display-driver-avatar">

                                        <UserCheck size={18} />

                                    </div>

                                    <div className="display-driver-info">

                                        <div className="display-driver-name">

                                            <strong>
                                                {driver.name}
                                            </strong>

                                            <span
                                                className={
                                                    driver.type === "guest"
                                                        ? "display-driver-badge guest"
                                                        : "display-driver-badge"
                                                }
                                            >
                                                {driver.type === "guest"
                                                    ? "مهمان"
                                                    : "اصلی"}
                                            </span>

                                        </div>

                                        <span className="display-driver-phone">

                                            {driver.phone || "-"}

                                        </span>

                                    </div>

                                </div>


                                <div className="display-driver-vehicle">

                                    <Truck size={16} />

                                    <span>
                                        {driver.vehicleType || "-"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>


                    {!driversLoading &&
                        dailyDrivers.length === 0 && (

                            <div className="display-empty">

                                <UserCheck size={30} />

                                <strong>
                                    امروز راننده‌ای ثبت نشده
                                </strong>

                                <span>
                                    از بخش ورود روزانه رانندگان، راننده ثبت کنید.
                                </span>

                            </div>

                        )}

                </section>

            </div>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div className="display-footer">

                <div>

                    <div className="display-live-dot" />

                    <span>
                        مانیتورینگ فعال است
                    </span>

                </div>

                <span>
                    آخرین بروزرسانی:
                    {" "}
                    {lastUpdate || "در حال دریافت"}
                </span>

                <RefreshCw size={16} />

            </div>

        </main>

    );
}