"use client";

import { SkeletonList } from "@/components/ui/Skeleton";

import { useEffect, useState } from "react";

import {
    Package,
    UserCheck,
    Truck,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

function getTodayKey() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function toPersianNumber(value) {
    return String(value ?? "").replace(
        /\d/g,
        (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}

function getVehicleTypeLabel(type) {
    const vehicleTypes = {
        truck: "کامیون",
        trailer: "تریلی",
        pickup: "نیسان",
        van: "وانت",
    };

    return vehicleTypes[type] || type || "—";
}

/* =========================================================
   PAGE
========================================================= */

export default function DisplayPage() {
    const [dailyDrivers, setDailyDrivers] = useState([]);
    const [loads, setLoads] = useState([]);

    const [currentDate, setCurrentDate] = useState("");
    const [lastUpdate, setLastUpdate] = useState("");
    const [loaded, setLoaded] = useState(false);

    /* =====================================================
       LOAD DATABASE DATA
    ===================================================== */

    async function fetchDisplayData() {
        try {
            const [driversResponse, loadsResponse] =
                await Promise.all([
                    fetch(
                        "/api/daily-drivers",
                        {
                            cache: "no-store",
                        }
                    ),

                    fetch(
                        "/api/loads",
                        {
                            cache: "no-store",
                        }
                    ),
                ]);

            /* ---------------------------------------------
               DAILY DRIVERS
            --------------------------------------------- */

            if (driversResponse.ok) {
                const driversResult =
                    await driversResponse.json();

                const driversList =
                    Array.isArray(driversResult)
                        ? driversResult
                        : Array.isArray(
                            driversResult.dailyDrivers
                        )
                            ? driversResult.dailyDrivers
                            : [];

                /*
                 * ترتیب صف:
                 * اولین راننده بالا
                 * آخرین راننده پایین
                 */

                const sortedDrivers =
                    [...driversList].sort(
                        (a, b) => {
                            const aTime =
                                new Date(
                                    a.createdAt || 0
                                ).getTime();

                            const bTime =
                                new Date(
                                    b.createdAt || 0
                                ).getTime();

                            return aTime - bTime;
                        }
                    );

                setDailyDrivers(
                    sortedDrivers
                );
            }

            /* ---------------------------------------------
               LOADS
            --------------------------------------------- */

            if (loadsResponse.ok) {
                const loadsResult =
                    await loadsResponse.json();

                const loadsList =
                    Array.isArray(loadsResult)
                        ? loadsResult
                        : Array.isArray(
                            loadsResult.loads
                        )
                            ? loadsResult.loads
                            : [];

                /*
                 * ترتیب بارها:
                 * جدیدترین بار اول
                 */

                const sortedLoads =
                    [...loadsList].sort(
                        (a, b) => {
                            const aTime =
                                new Date(
                                    a.createdAt || 0
                                ).getTime();

                            const bTime =
                                new Date(
                                    b.createdAt || 0
                                ).getTime();

                            return (
                                bTime - aTime
                            );
                        }
                    );

                setLoads(
                    sortedLoads
                );
            }

            /* ---------------------------------------------
               LAST UPDATE
            --------------------------------------------- */

            setLastUpdate(
                new Date().toLocaleTimeString(
                    "fa-IR",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                )
            );
        } catch (error) {
            console.error(
                "Display data error:",
                error
            );
        } finally {
            setLoaded(true);
        }
    }

    /* =====================================================
       INITIAL LOAD + CLOCK + SYNC
    ===================================================== */

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();

            setCurrentDate(
                now.toLocaleDateString(
                    "fa-IR"
                )
            );

            setLastUpdate(
                now.toLocaleTimeString(
                    "fa-IR",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    }
                )
            );
        };

        updateClock();

        fetchDisplayData();

        const clockInterval =
            setInterval(
                updateClock,
                1000
            );

        /*
         * وقتی Sync تغییر را تشخیص داد،
         * فقط اطلاعات مانیتورینگ دوباره دریافت می‌شود.
         *
         * کل صفحه reload نمی‌شود.
         */

        const handleSyncUpdate = () => {
            fetchDisplayData();
        };

        window.addEventListener(
            "tms-sync-updated",
            handleSyncUpdate
        );

        return () => {
            clearInterval(
                clockInterval
            );

            window.removeEventListener(
                "tms-sync-updated",
                handleSyncUpdate
            );
        };
    }, []);

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <main className="main-content display-page">

            <style>{`
                @media (min-width: 1100px) {
                    .display-grid.display-grid-drivers-first {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        align-items: start;
                    }

                    .display-grid.display-grid-drivers-first > .display-panel {
                        min-width: 0;
                    }
                }

                .display-panel-drivers .display-driver-name strong {
                    font-size: 20px;
                }

                .display-panel-drivers .display-driver-badge {
                    font-size: 13px;
                }

                .display-panel-drivers .display-driver-phone {
                    font-size: 15px;
                }

                .display-panel-drivers .display-driver-vehicle {
                    font-size: 16px;
                }

                .display-panel-drivers .display-driver-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    width: 52px;
                    height: 52px;
                    font-size: 24px;
                    font-weight: 800;
                }

                .display-panel-drivers .display-driver-item {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }

                .display-panel-loads .display-item-title strong {
                    font-size: 22px;
                }

                .display-panel-loads .display-company {
                    font-size: 17px;
                }

                .display-panel-loads .display-route {
                    font-size: 18px;
                }

                .display-panel-loads .display-load-meta {
                    font-size: 16px;
                }

                .display-panel-loads .display-item-icon svg,
                .display-panel-loads .display-load-meta svg {
                    width: 22px;
                    height: 22px;
                }

                .display-panel-loads .display-load-item {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
            `}</style>

            {/* =================================================
                GRID
            ================================================= */}

            <div className="display-grid display-grid-drivers-first">

                {/* =================================================
                    DAILY DRIVERS
                ================================================= */}

                <section className="display-panel display-panel-drivers">

                    <div className="display-panel-header">

                        <div className="display-panel-title">

                            <div className="display-panel-icon display-panel-blue">
                                <UserCheck
                                    size={21}
                                />
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

                            {toPersianNumber(
                                dailyDrivers.length
                            )} راننده

                        </span>

                    </div>

                    <div className="display-list">

                        {!loaded && <SkeletonList rows={4} />}

                        {dailyDrivers.map(
                            (driver, index) => {

                                const isGuest =
                                    driver.type ===
                                    "guest";

                                const realDriver =
                                    driver.driverId &&
                                    typeof driver.driverId ===
                                    "object"
                                        ? driver.driverId
                                        : null;

                                return (
                                    <div
                                        className="display-driver-item"
                                        key={
                                            driver._id
                                        }
                                    >

                                        <div className="display-driver-main">

                                            <div className="display-driver-avatar">
                                                {toPersianNumber(
                                                    index + 1
                                                )}
                                            </div>

                                            <div className="display-driver-info">

                                                <div className="display-driver-name">

                                                    <strong>
                                                        {driver.name}
                                                    </strong>

                                                    <span
                                                        className={
                                                            isGuest
                                                                ? "display-driver-badge guest"
                                                                : "display-driver-badge"
                                                        }
                                                    >
                                                        {isGuest
                                                            ? "مهمان"
                                                            : "اصلی"}
                                                    </span>

                                                </div>

                                                <span className="display-driver-phone">
                                                    {driver.phone ||
                                                        "—"}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="display-driver-vehicle">

                                            <Truck
                                                size={20}
                                            />

                                            <span>
                                                {getVehicleTypeLabel(
                                                    driver.vehicleType ||
                                                    realDriver?.vehicleType
                                                )}
                                            </span>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {loaded && dailyDrivers.length === 0 && (

                        <div className="display-empty">

                            <UserCheck
                                size={30}
                            />

                            <strong>
                                امروز راننده‌ای ثبت نشده
                            </strong>

                            <span>
                                از بخش ورود روزانه رانندگان، راننده ثبت کنید.
                            </span>

                        </div>

                    )}

                </section>

                {/* =================================================
                    LOADS
                ================================================= */}

                <section className="display-panel display-panel-loads">

                    <div className="display-panel-header">

                        <div className="display-panel-title">

                            <div className="display-panel-icon display-panel-orange">
                                <Package
                                    size={21}
                                />
                            </div>

                            <div>

                                <h2>
                                    بارها
                                </h2>

                                <p>
                                    لیست بارهای ثبت‌شده در سیستم
                                </p>

                            </div>

                        </div>

                        <span className="display-count orange">

                            {toPersianNumber(
                                loads.length
                            )} بار

                        </span>

                    </div>

                    <div className="display-list">

                        {!loaded && <SkeletonList rows={4} />}

                        {loads.map(
                            (load) => {

                                return (
                                    <div
                                        className="display-load-item"
                                        key={
                                            load._id ||
                                            load.loadId
                                        }
                                    >

                                        <div className="display-item-main">

                                            <div className="display-item-icon load">
                                                <Package
                                                    size={19}
                                                />
                                            </div>

                                            <div className="display-item-info">

                                                <div className="display-item-title">

                                                    <strong>
                                                        {load.title ||
                                                            "بدون عنوان"}
                                                    </strong>

                                                </div>

                                                <span className="display-company">

                                                    {load.companyName ||
                                                        load.company?.name ||
                                                        "—"}

                                                </span>

                                                <div className="display-route">

                                                    <span>
                                                        {load.origin ||
                                                            "—"}
                                                    </span>

                                                    <span className="route-arrow">
                                                        ←
                                                    </span>

                                                    <span>
                                                        {load.destination ||
                                                            "—"}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="display-load-meta">

                                            <div>

                                                <Truck
                                                    size={15}
                                                />

                                                <span>
                                                    {getVehicleTypeLabel(
                                                        load.vehicleType
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>

                    {loaded && loads.length === 0 && (

                        <div className="display-empty">

                            <Package
                                size={30}
                            />

                            <strong>
                                باری ثبت نشده است
                            </strong>

                            <span>
                                هنوز هیچ باری در سیستم ثبت نشده است.
                            </span>

                        </div>

                    )}

                </section>

            </div>

        </main>
    );
}