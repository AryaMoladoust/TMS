"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserRound,
    Phone,
    Truck,
} from "lucide-react";

export default function DailyDriversList() {
    const [dailyDrivers, setDailyDrivers] = useState([]);
    const [mounted, setMounted] = useState(false);

    function getTodayKey() {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(
            now.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
            now.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const todayKey = getTodayKey();

        const savedData =
            localStorage.getItem(
                "daily-drivers"
            );

        const savedDate =
            localStorage.getItem(
                "daily-drivers-date"
            );

        if (
            savedData &&
            savedDate === todayKey
        ) {
            try {
                setDailyDrivers(
                    JSON.parse(savedData)
                );
            } catch {
                setDailyDrivers([]);
            }
        } else {
            setDailyDrivers([]);

            localStorage.setItem(
                "daily-drivers",
                JSON.stringify([])
            );

            localStorage.setItem(
                "daily-drivers-date",
                todayKey
            );
        }

        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        function updateDrivers() {
            const todayKey = getTodayKey();

            const savedData =
                localStorage.getItem(
                    "daily-drivers"
                );

            const savedDate =
                localStorage.getItem(
                    "daily-drivers-date"
                );

            if (savedDate !== todayKey) {
                setDailyDrivers([]);
                return;
            }

            if (savedData) {
                try {
                    setDailyDrivers(
                        JSON.parse(savedData)
                    );
                } catch {
                    setDailyDrivers([]);
                }
            }
        }

        const interval = setInterval(
            updateDrivers,
            2000
        );

        window.addEventListener(
            "storage",
            updateDrivers
        );

        return () => {
            clearInterval(interval);

            window.removeEventListener(
                "storage",
                updateDrivers
            );
        };
    }, [mounted]);

    return (
        <section className="daily-drivers-list-panel">

            <div className="daily-drivers-list-header">

                <div className="daily-drivers-list-heading">

                    <div className="daily-drivers-list-icon">
                        <Users size={21} />
                    </div>

                    <div>
                        <h2>
                            رانندگان امروز
                        </h2>

                        <p>
                            رانندگانی که امروز به شرکت مراجعه کرده‌اند
                        </p>
                    </div>

                </div>

                <div className="daily-drivers-list-actions">

                    <span className="daily-drivers-list-count">
                        {dailyDrivers.length} راننده
                    </span>

                    <a
                        href="/daily-drivers"
                        className="daily-drivers-manage-button"
                    >
                        مدیریت ورود روزانه
                    </a>

                </div>

            </div>

            {dailyDrivers.length === 0 ? (
                <div className="daily-drivers-list-empty">

                    <Users size={30} />

                    <strong>
                        هنوز راننده‌ای برای امروز ثبت نشده است
                    </strong>

                    <span>
                        از بخش «ورود روزانه رانندگان» اولین راننده را اضافه کنید.
                    </span>

                    <a
                        href="/daily-drivers"
                        className="daily-drivers-empty-button"
                    >
                        ورود روزانه رانندگان
                    </a>

                </div>
            ) : (
                <div className="daily-drivers-mini-table-wrapper">

                    <table className="daily-drivers-mini-table">

                        <thead>
                            <tr>
                                <th>نام راننده</th>
                                <th>شماره</th>
                                <th>نوع ماشین</th>
                                <th>نوع ورود</th>
                            </tr>
                        </thead>

                        <tbody>
                            {dailyDrivers.map(
                                (driver, index) => (
                                    <tr key={driver.id}>

                                        <td>
                                            <div className="daily-drivers-mini-name">

                                                <div className="daily-drivers-mini-avatar">
                                                    <UserRound size={17} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {driver.name}
                                                    </strong>

                                                    <span>
                                                        نفر {index + 1}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <div className="daily-drivers-mini-info">

                                                <Phone size={15} />

                                                <span>
                                                    {driver.phone}
                                                </span>

                                            </div>
                                        </td>

                                        <td>
                                            <div className="daily-drivers-mini-info">

                                                <Truck size={15} />

                                                <span>
                                                    {driver.vehicleType}
                                                </span>

                                            </div>
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    driver.type ===
                                                        "registered"
                                                        ? "daily-driver-mini-type daily-driver-mini-type-main"
                                                        : "daily-driver-mini-type daily-driver-mini-type-guest"
                                                }
                                            >
                                                {driver.type ===
                                                    "registered"
                                                    ? "اصلی"
                                                    : "مهمان"}
                                            </span>

                                        </td>

                                    </tr>
                                )
                            )}
                        </tbody>

                    </table>

                </div>
            )}

        </section>
    );
}