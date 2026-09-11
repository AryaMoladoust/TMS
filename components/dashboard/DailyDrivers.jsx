"use client";

import { useEffect, useState } from "react";
import {
    Users,
    UserRound,
    Phone,
    Truck,
    RotateCcw,
    UserCheck,
    UserPlus,
    Plus,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Mock Registered Drivers
|--------------------------------------------------------------------------
| فعلاً رانندگان ثبت‌شده نمونه هستند.
| بعداً از MongoDB / API دریافت می‌شوند.
*/

const registeredDrivers = [
    {
        id: "DRV-1001",
        name: "علی رضایی",
    },
    {
        id: "DRV-1002",
        name: "محمد کریمی",
    },
    {
        id: "DRV-1003",
        name: "رضا احمدی",
    },
    {
        id: "DRV-1004",
        name: "حسین مرادی",
    },
    {
        id: "DRV-1005",
        name: "امیر حسینی",
    },
    {
        id: "DRV-1006",
        name: "مجتبی اکبری",
    },
];

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getTodayKey() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function DailyDrivers() {
    const [driverMode, setDriverMode] =
        useState("registered");

    const [selectedRegisteredDriver, setSelectedRegisteredDriver] =
        useState("");

    const [guestDriver, setGuestDriver] = useState({
        name: "",
        phone: "",
        vehicleType: "",
    });

    const [dailyDrivers, setDailyDrivers] = useState([]);

    const [mounted, setMounted] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Load today's drivers
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const todayKey = getTodayKey();

        const savedData = localStorage.getItem(
            "daily-drivers"
        );

        const savedDate = localStorage.getItem(
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
            localStorage.setItem(
                "daily-drivers-date",
                todayKey
            );

            localStorage.setItem(
                "daily-drivers",
                JSON.stringify([])
            );

            setDailyDrivers([]);
        }

        setMounted(true);
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Save today's drivers
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!mounted) return;

        localStorage.setItem(
            "daily-drivers",
            JSON.stringify(dailyDrivers)
        );

        localStorage.setItem(
            "daily-drivers-date",
            getTodayKey()
        );
    }, [dailyDrivers, mounted]);

    /*
    |--------------------------------------------------------------------------
    | Switch mode
    |--------------------------------------------------------------------------
    */

    function changeDriverMode(mode) {
        setDriverMode(mode);

        setSelectedRegisteredDriver("");

        setGuestDriver({
            name: "",
            phone: "",
            vehicleType: "",
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Add Registered Driver
    |--------------------------------------------------------------------------
    */

    function addRegisteredDriver() {
        if (!selectedRegisteredDriver) {
            alert("لطفاً یک راننده را انتخاب کنید.");
            return;
        }

        const driver = registeredDrivers.find(
            (item) =>
                item.id === selectedRegisteredDriver
        );

        if (!driver) return;

        const alreadyAdded = dailyDrivers.some(
            (item) => item.driverId === driver.id
        );

        if (alreadyAdded) {
            alert("این راننده امروز قبلاً ثبت شده است.");
            return;
        }

        const newDriver = {
            id: `${Date.now()}`,
            driverId: driver.id,
            type: "registered",
            name: driver.name,
            phone: "-",
            vehicleType: "-",
        };

        setDailyDrivers((previous) => [
            ...previous,
            newDriver,
        ]);

        setSelectedRegisteredDriver("");
    }

    /*
    |--------------------------------------------------------------------------
    | Add Guest Driver
    |--------------------------------------------------------------------------
    */

    function addGuestDriver() {
        const name = guestDriver.name.trim();
        const phone = guestDriver.phone.trim();
        const vehicleType =
            guestDriver.vehicleType.trim();

        if (!name || !phone || !vehicleType) {
            alert(
                "لطفاً نام، شماره موبایل و نوع ماشین را وارد کنید."
            );

            return;
        }

        const newDriver = {
            id: `${Date.now()}`,
            driverId: null,
            type: "guest",
            name,
            phone,
            vehicleType,
        };

        setDailyDrivers((previous) => [
            ...previous,
            newDriver,
        ]);

        setGuestDriver({
            name: "",
            phone: "",
            vehicleType: "",
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Remove One Driver
    |--------------------------------------------------------------------------
    */

    function removeDriver(id) {
        setDailyDrivers((previous) =>
            previous.filter(
                (driver) => driver.id !== id
            )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Reset Today's List
    |--------------------------------------------------------------------------
    */

    function resetDailyDrivers() {
        if (dailyDrivers.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            "آیا مطمئن هستید که لیست رانندگان امروز پاک شود؟"
        );

        if (!confirmed) return;

        setDailyDrivers([]);
    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <section className="daily-drivers-panel">

            {/* =====================================================
          HEADER
      ====================================================== */}

            <div className="daily-drivers-header">

                <div className="daily-drivers-heading">

                    <div className="daily-drivers-icon">
                        <Users size={22} />
                    </div>

                    <div>
                        <h2>
                            ورود روزانه رانندگان
                        </h2>

                        <p>
                            رانندگانی که امروز به شرکت مراجعه کرده‌اند
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    className="daily-drivers-reset"
                    onClick={resetDailyDrivers}
                >
                    <RotateCcw size={17} />
                    <span>ریست امروز</span>
                </button>

            </div>

            {/* =====================================================
          DRIVER TYPE SWITCH
      ====================================================== */}

            <div className="daily-driver-mode-box">

                <div className="daily-driver-mode-label">
                    <span>
                        نوع راننده
                    </span>

                    <small>
                        راننده را مشخص کنید
                    </small>
                </div>

                <div className="daily-driver-switch">

                    <button
                        type="button"
                        className={
                            driverMode === "registered"
                                ? "daily-driver-switch-active"
                                : ""
                        }
                        onClick={() =>
                            changeDriverMode("registered")
                        }
                    >
                        <UserCheck size={17} />
                        راننده اصلی
                    </button>

                    <button
                        type="button"
                        className={
                            driverMode === "guest"
                                ? "daily-driver-switch-active"
                                : ""
                        }
                        onClick={() =>
                            changeDriverMode("guest")
                        }
                    >
                        <UserPlus size={17} />
                        راننده مهمان
                    </button>

                </div>

            </div>

            {/* =====================================================
          REGISTERED DRIVER FORM
      ====================================================== */}

            {driverMode === "registered" && (
                <div className="daily-driver-entry">

                    <div className="daily-driver-entry-title">
                        <UserCheck size={19} />

                        <div>
                            <strong>
                                انتخاب راننده ثبت‌شده
                            </strong>

                            <span>
                                فقط نام راننده از لیست انتخاب می‌شود.
                            </span>
                        </div>
                    </div>

                    <div className="daily-driver-form-row">

                        <div className="daily-driver-select-wrapper">

                            <UserRound size={18} />

                            <select
                                value={selectedRegisteredDriver}
                                onChange={(event) =>
                                    setSelectedRegisteredDriver(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="">
                                    نام راننده را انتخاب کنید
                                </option>

                                {registeredDrivers.map(
                                    (driver) => (
                                        <option
                                            key={driver.id}
                                            value={driver.id}
                                        >
                                            {driver.name}
                                        </option>
                                    )
                                )}

                            </select>

                        </div>

                        <button
                            type="button"
                            className="daily-driver-add-button"
                            onClick={addRegisteredDriver}
                        >
                            <Plus size={18} />
                            افزودن راننده
                        </button>

                    </div>

                </div>
            )}

            {/* =====================================================
          GUEST DRIVER FORM
      ====================================================== */}

            {driverMode === "guest" && (
                <div className="daily-driver-entry">

                    <div className="daily-driver-entry-title">
                        <UserPlus size={19} />

                        <div>
                            <strong>
                                ورود اطلاعات راننده مهمان
                            </strong>

                            <span>
                                اطلاعات راننده عبوری را وارد کنید.
                            </span>
                        </div>
                    </div>

                    <div className="daily-driver-form-row daily-driver-guest-row">

                        {/* Name */}

                        <div className="daily-driver-input-wrapper">

                            <UserRound size={18} />

                            <input
                                type="text"
                                value={guestDriver.name}
                                onChange={(event) =>
                                    setGuestDriver({
                                        ...guestDriver,
                                        name: event.target.value,
                                    })
                                }
                                placeholder="نام راننده"
                            />

                        </div>

                        {/* Phone */}

                        <div className="daily-driver-input-wrapper">

                            <Phone size={18} />

                            <input
                                type="tel"
                                value={guestDriver.phone}
                                onChange={(event) =>
                                    setGuestDriver({
                                        ...guestDriver,
                                        phone: event.target.value,
                                    })
                                }
                                placeholder="شماره موبایل"
                            />

                        </div>

                        {/* Vehicle */}

                        <div className="daily-driver-input-wrapper">

                            <Truck size={18} />

                            <select
                                value={guestDriver.vehicleType}
                                onChange={(event) =>
                                    setGuestDriver({
                                        ...guestDriver,
                                        vehicleType:
                                            event.target.value,
                                    })
                                }
                            >
                                <option value="">
                                    نوع ماشین
                                </option>

                                <option value="کامیون">
                                    کامیون
                                </option>

                                <option value="تریلی">
                                    تریلی
                                </option>

                                <option value="نیسان">
                                    نیسان
                                </option>

                                <option value="وانت">
                                    وانت
                                </option>

                            </select>

                        </div>

                        <button
                            type="button"
                            className="daily-driver-add-button"
                            onClick={addGuestDriver}
                        >
                            <Plus size={18} />
                            افزودن
                        </button>

                    </div>

                </div>
            )}

            {/* =====================================================
          TODAY'S DRIVER LIST
      ====================================================== */}

            <div className="daily-driver-list-section">

                <div className="daily-driver-list-header">

                    <div>
                        <h3>
                            لیست رانندگان امروز
                        </h3>

                        <p>
                            رانندگان ثبت‌شده برای امروز
                        </p>
                    </div>

                    <span className="daily-driver-count">
                        {dailyDrivers.length} راننده
                    </span>

                </div>

                {dailyDrivers.length === 0 ? (
                    <div className="daily-driver-empty">

                        <Users size={28} />

                        <strong>
                            هنوز راننده‌ای ثبت نشده است
                        </strong>

                        <span>
                            اولین راننده امروز را از بخش بالا اضافه کنید.
                        </span>

                    </div>
                ) : (
                    <div className="daily-driver-table-wrapper">

                        <table className="daily-driver-table">

                            <thead>
                                <tr>
                                    <th>نام راننده</th>
                                    <th>شماره</th>
                                    <th>نوع ماشین</th>
                                    <th>نوع ورود</th>
                                    <th>عملیات</th>
                                </tr>
                            </thead>

                            <tbody>

                                {dailyDrivers.map(
                                    (driver, index) => (
                                        <tr key={driver.id}>

                                            <td>
                                                <div className="daily-driver-name">

                                                    <div className="daily-driver-avatar">
                                                        <UserRound size={18} />
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
                                                <div className="daily-driver-info">
                                                    <Phone size={16} />
                                                    {driver.phone}
                                                </div>
                                            </td>

                                            <td>
                                                <div className="daily-driver-info">
                                                    <Truck size={16} />
                                                    {driver.vehicleType}
                                                </div>
                                            </td>

                                            <td>

                                                <span
                                                    className={
                                                        driver.type ===
                                                            "registered"
                                                            ? "daily-driver-type daily-driver-type-main"
                                                            : "daily-driver-type daily-driver-type-guest"
                                                    }
                                                >
                                                    {driver.type ===
                                                        "registered"
                                                        ? "اصلی"
                                                        : "مهمان"}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="daily-driver-remove"
                                                    onClick={() =>
                                                        removeDriver(
                                                            driver.id
                                                        )
                                                    }
                                                >
                                                    حذف
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </section>
    );
}