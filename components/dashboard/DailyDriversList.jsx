"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserRound,
    Phone,
    Truck,
} from "lucide-react";

const vehicleTypes = [
    { value: "truck", label: "کامیون" },
    { value: "trailer", label: "تریلی" },
    { value: "pickup", label: "وانت" },
    { value: "van", label: "ون" },
];

function getVehicleLabel(vehicleType) {
    const vehicle = vehicleTypes.find(
        (item) => item.value === vehicleType
    );

    return vehicle?.label || vehicleType || "-";
}

function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function DailyDriversList() {
    const [dailyDrivers, setDailyDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

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

            setDailyDrivers(
                Array.isArray(data) ? data : data.dailyDrivers || []
            );
        } catch (error) {
            console.error("Daily drivers fetch error:", error);
            setDailyDrivers([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDailyDrivers();

        const interval = setInterval(() => {
            loadDailyDrivers();
        }, 5000);

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

            {loading ? (
                <div className="daily-drivers-list-empty">

                    <Users size={30} />

                    <strong>
                        در حال دریافت لیست رانندگان...
                    </strong>

                </div>
            ) : dailyDrivers.length === 0 ? (
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

                                    <tr key={driver._id}>

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
                                                    {driver.phone || "-"}
                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <div className="daily-drivers-mini-info">

                                                <Truck size={15} />

                                                <span>
                                                    {getVehicleLabel(driver.vehicleType)}
                                                </span>

                                            </div>

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    `daily-driver-mini-type ${
                                                        driver.type === "main"
                                                            ? "daily-driver-mini-type-main"
                                                            : "daily-driver-mini-type-guest"
                                                    }`
                                                }
                                            >
                                                {driver.type === "main"
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
