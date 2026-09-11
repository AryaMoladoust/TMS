"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Users,
  UserRound,
  Phone,
  Truck,
  RotateCcw,
  UserCheck,
  UserPlus,
  Plus,
} from "lucide-react";

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

function getTodayKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialDrivers() {
  if (typeof window === "undefined") {
    return [];
  }

  const savedDate = localStorage.getItem(
    "daily-drivers-date"
  );

  if (savedDate !== getTodayKey()) {
    return [];
  }

  try {
    return JSON.parse(
      localStorage.getItem("daily-drivers") || "[]"
    );
  } catch {
    return [];
  }
}

export default function DailyDriversPage() {
  const [driverMode, setDriverMode] = useState("registered");

  const [selectedDriver, setSelectedDriver] = useState("");

  const [guestDriver, setGuestDriver] = useState({
    name: "",
    phone: "",
    vehicleType: "",
  });

  const [dailyDrivers, setDailyDrivers] = useState(
    getInitialDrivers
  );

  function saveDrivers(drivers) {
    setDailyDrivers(drivers);

    localStorage.setItem(
      "daily-drivers",
      JSON.stringify(drivers)
    );

    localStorage.setItem(
      "daily-drivers-date",
      getTodayKey()
    );

    window.dispatchEvent(
      new Event("daily-drivers-updated")
    );
  }

  function changeMode(mode) {
    setDriverMode(mode);
    setSelectedDriver("");

    setGuestDriver({
      name: "",
      phone: "",
      vehicleType: "",
    });
  }

  function addRegisteredDriver() {
    if (!selectedDriver) {
      alert("لطفاً یک راننده را انتخاب کنید.");
      return;
    }

    const driver = registeredDrivers.find(
      (item) => item.id === selectedDriver
    );

    if (!driver) return;

    const alreadyExists = dailyDrivers.some(
      (item) => item.driverId === driver.id
    );

    if (alreadyExists) {
      alert("این راننده امروز قبلاً ثبت شده است.");
      return;
    }

    const newDriver = {
      id: Date.now().toString(),
      driverId: driver.id,
      type: "registered",
      name: driver.name,
      phone: "-",
      vehicleType: "-",
    };

    saveDrivers([
      ...dailyDrivers,
      newDriver,
    ]);

    setSelectedDriver("");
  }

  function addGuestDriver() {
    const name = guestDriver.name.trim();
    const phone = guestDriver.phone.trim();
    const vehicleType = guestDriver.vehicleType.trim();

    if (!name || !phone || !vehicleType) {
      alert(
        "لطفاً نام، شماره موبایل و نوع ماشین را وارد کنید."
      );
      return;
    }

    const newDriver = {
      id: Date.now().toString(),
      driverId: null,
      type: "guest",
      name,
      phone,
      vehicleType,
    };

    saveDrivers([
      ...dailyDrivers,
      newDriver,
    ]);

    setGuestDriver({
      name: "",
      phone: "",
      vehicleType: "",
    });
  }

  function removeDriver(id) {
    const updated = dailyDrivers.filter(
      (driver) => driver.id !== id
    );

    saveDrivers(updated);
  }

  function resetToday() {
    if (dailyDrivers.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "آیا مطمئن هستید لیست رانندگان امروز پاک شود؟"
    );

    if (!confirmed) return;

    saveDrivers([]);
  }

  return (
    <main className="main-content">

      <div className="page-heading">
        <div className="page-back-link">
          <Link href="/">
            <ArrowRight size={17} />
            بازگشت به صفحه اصلی
          </Link>
        </div>

        <h1>ورود روزانه رانندگان</h1>

        <p>
          ثبت رانندگانی که امروز به شرکت مراجعه کرده‌اند
        </p>
      </div>

      <section className="daily-entry-page">

        {/* Header */}

        <div className="daily-entry-page-header">
          <div className="daily-entry-page-icon">
            <Users size={25} />
          </div>

          <div>
            <h2>ثبت راننده امروز</h2>

            <p>
              نوع راننده را انتخاب کرده و اطلاعات موردنیاز را وارد کنید.
            </p>
          </div>
        </div>

        {/* Driver type */}

        <div className="daily-entry-mode">

          <div>
            <strong>نوع راننده</strong>

            <span>
              راننده اصلی یا راننده مهمان
            </span>
          </div>

          <div className="daily-entry-switch">

            <button
              type="button"
              className={
                driverMode === "registered"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode("registered")
              }
            >
              <UserCheck size={18} />
              راننده اصلی
            </button>

            <button
              type="button"
              className={
                driverMode === "guest"
                  ? "active"
                  : ""
              }
              onClick={() =>
                changeMode("guest")
              }
            >
              <UserPlus size={18} />
              راننده مهمان
            </button>

          </div>

        </div>

        {/* Registered driver */}

        {driverMode === "registered" && (
          <div className="daily-entry-form">

            <div className="daily-entry-form-title">

              <UserCheck size={20} />

              <div>
                <strong>
                  انتخاب راننده ثبت‌شده
                </strong>

                <span>
                  فقط نام راننده را از لیست انتخاب کنید.
                </span>
              </div>

            </div>

            <div className="daily-entry-form-row">

              <div className="daily-entry-input">

                <UserRound size={18} />

                <select
                  value={selectedDriver}
                  onChange={(event) =>
                    setSelectedDriver(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    انتخاب نام راننده
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
                className="daily-entry-add"
                onClick={
                  addRegisteredDriver
                }
              >
                <Plus size={19} />
                افزودن راننده
              </button>

            </div>

          </div>
        )}

        {/* Guest driver */}

        {driverMode === "guest" && (
          <div className="daily-entry-form">

            <div className="daily-entry-form-title">

              <UserPlus size={20} />

              <div>
                <strong>
                  ورود راننده مهمان
                </strong>

                <span>
                  اطلاعات راننده عبوری را وارد کنید.
                </span>
              </div>

            </div>

            <div className="daily-entry-form-row guest">

              <div className="daily-entry-input">

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

              <div className="daily-entry-input">

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

              <div className="daily-entry-input">

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
                className="daily-entry-add"
                onClick={addGuestDriver}
              >
                <Plus size={19} />
                افزودن
              </button>

            </div>

          </div>
        )}

        {/* Today's list */}

        <div className="daily-entry-list">

          <div className="daily-entry-list-header">

            <div>
              <h3>
                لیست رانندگان امروز
              </h3>

              <p>
                {dailyDrivers.length} راننده ثبت شده است
              </p>
            </div>

            <button
              type="button"
              className="daily-entry-reset"
              onClick={resetToday}
            >
              <RotateCcw size={17} />
              ریست امروز
            </button>

          </div>

          {dailyDrivers.length === 0 ? (
            <div className="daily-entry-empty">

              <Users size={32} />

              <strong>
                هنوز راننده‌ای ثبت نشده است
              </strong>

              <span>
                اولین راننده امروز را از بخش بالا اضافه کنید.
              </span>

            </div>
          ) : (
            <div className="daily-entry-table-wrapper">

              <table className="daily-entry-table">

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
                          <div className="daily-entry-name">

                            <div className="daily-entry-avatar">
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
                          {driver.phone}
                        </td>

                        <td>
                          {driver.vehicleType}
                        </td>

                        <td>

                          <span
                            className={
                              driver.type ===
                              "registered"
                                ? "daily-entry-type main"
                                : "daily-entry-type guest"
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
                            className="daily-entry-remove"
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

    </main>
  );
}