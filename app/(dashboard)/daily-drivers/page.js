"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

import DriverSearchSelect from "@/components/daily-drivers/DriverSearchSelect";

const registeredDrivers = [
  {
    id: "DRV-1001",
    name: "علی رضایی",
    phone: "09121234567",
    vehicleType: "تریلی",
  },
  {
    id: "DRV-1002",
    name: "محمد کریمی",
    phone: "09129876543",
    vehicleType: "کامیون",
  },
  {
    id: "DRV-1003",
    name: "رضا احمدی",
    phone: "09121112233",
    vehicleType: "کامیونت",
  },
  {
    id: "DRV-1004",
    name: "حسین مرادی",
    phone: "09124445566",
    vehicleType: "تریلی",
  },
  {
    id: "DRV-1005",
    name: "امیر حسینی",
    phone: "09123334455",
    vehicleType: "وانت",
  },
  {
    id: "DRV-1006",
    name: "مجتبی اکبری",
    phone: "09125556677",
    vehicleType: "کامیون",
  },
];

const vehicleTypes = [
  { value: "تریلی", label: "تریلی" },
  { value: "کامیون", label: "کامیون" },
  { value: "کامیونت", label: "کامیونت" },
  { value: "وانت", label: "وانت" },
  { value: "نیسان", label: "نیسان" },
  { value: "ون", label: "ون" },
];

function getTodayKey() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getInitialDrivers() {
  if (typeof window === "undefined") {
    return [];
  }

  const savedDate = localStorage.getItem(
    "daily-drivers-date"
  );

  const today = getTodayKey();

  if (savedDate !== today) {
    return [];
  }

  try {
    const savedDrivers = localStorage.getItem(
      "daily-drivers"
    );

    return savedDrivers
      ? JSON.parse(savedDrivers)
      : [];
  } catch {
    return [];
  }
}

export default function DailyDriversPage() {
  const [driverMode, setDriverMode] =
    useState("registered");

  const [selectedDriver, setSelectedDriver] =
    useState("");

  const [guestDriver, setGuestDriver] = useState({
    name: "",
    phone: "",
    vehicleType: "",
  });

  const [dailyDrivers, setDailyDrivers] =
    useState(getInitialDrivers);

  useEffect(() => {
    localStorage.setItem(
      "daily-drivers-date",
      getTodayKey()
    );

    localStorage.setItem(
      "daily-drivers",
      JSON.stringify(dailyDrivers)
    );

    window.dispatchEvent(
      new CustomEvent("daily-drivers-updated")
    );
  }, [dailyDrivers]);

  function addRegisteredDriver() {
    if (!selectedDriver) {
      alert("لطفاً یک راننده را انتخاب کنید.");
      return;
    }

    const driver = registeredDrivers.find(
      (item) => item.id === selectedDriver
    );

    if (!driver) {
      return;
    }

    const alreadyExists = dailyDrivers.some(
      (item) =>
        item.driverId === driver.id &&
        item.type === "main"
    );

    if (alreadyExists) {
      alert("این راننده قبلاً برای امروز ثبت شده است.");
      return;
    }

    const newDriver = {
      id: Date.now(),
      driverId: driver.id,
      name: driver.name,
      phone: driver.phone || "-",
      vehicleType: driver.vehicleType || "-",
      type: "main",
    };

    setDailyDrivers((previous) => [
      ...previous,
      newDriver,
    ]);

    setSelectedDriver("");
  }

  function addGuestDriver() {
    if (!guestDriver.name.trim()) {
      alert("نام راننده مهمان را وارد کنید.");
      return;
    }

    const newDriver = {
      id: Date.now(),
      driverId: `GUEST-${Date.now()}`,
      name: guestDriver.name.trim(),
      phone: guestDriver.phone.trim() || "-",
      vehicleType:
        guestDriver.vehicleType || "-",
      type: "guest",
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

  function removeDriver(id) {
    setDailyDrivers((previous) =>
      previous.filter((driver) => driver.id !== id)
    );
  }

  function resetToday() {
    const confirmed = window.confirm(
      "آیا مطمئن هستید که لیست ورود امروز پاک شود؟"
    );

    if (!confirmed) {
      return;
    }

    setDailyDrivers([]);
    setSelectedDriver("");

    localStorage.removeItem(
      "daily-drivers-date"
    );

    localStorage.removeItem("daily-drivers");
  }

  return (
    <main className="main-content">
      <div className="page-heading">
        <div>
          <h1>ورود روزانه رانندگان</h1>
          <p>
            ثبت رانندگان حاضر در سرویس امروز
          </p>
        </div>
      </div>

      <section className="daily-entry-page">
        <div className="daily-entry-page-header">
          <div className="daily-entry-page-icon">
            <UserCheck size={25} />
          </div>

          <div>
            <h2>ثبت ورود راننده</h2>

            <p>
              رانندگان اصلی یا مهمان حاضر در امروز را
              ثبت کنید.
            </p>
          </div>
        </div>

        <div className="daily-entry-mode">
          <div>
            <strong>نوع راننده</strong>

            <span>
              راننده ثبت‌شده در سیستم یا راننده مهمان
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
                setDriverMode("registered")
              }
            >
              <UserCheck size={15} />
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
                setDriverMode("guest")
              }
            >
              <UserPlus size={15} />
              راننده مهمان
            </button>
          </div>
        </div>

        {driverMode === "registered" ? (
          <div className="daily-entry-form">
            <div className="daily-entry-form-title">
              <UserRound size={18} />

              <div>
                <strong>
                  انتخاب راننده اصلی
                </strong>

                <span>
                  می‌توانید نام راننده را تایپ کنید تا
                  لیست محدود شود.
                </span>
              </div>
            </div>

            <div className="daily-entry-form-row">
              <DriverSearchSelect
                drivers={registeredDrivers}
                value={selectedDriver}
                onChange={setSelectedDriver}
                placeholder="نام راننده را جستجو کنید..."
              />

              <button
                type="button"
                className="daily-entry-add"
                onClick={addRegisteredDriver}
              >
                <Plus size={17} />
                ثبت ورود
              </button>
            </div>
          </div>
        ) : (
          <div className="daily-entry-form">
            <div className="daily-entry-form-title">
              <UserPlus size={18} />

              <div>
                <strong>
                  ثبت راننده مهمان
                </strong>

                <span>
                  اطلاعات راننده‌ای که در سیستم ثبت
                  نشده است را وارد کنید.
                </span>
              </div>
            </div>

            <div className="daily-entry-form-row guest">
              <div className="daily-entry-input">
                <UserRound size={17} />

                <input
                  type="text"
                  placeholder="نام راننده"
                  value={guestDriver.name}
                  onChange={(event) =>
                    setGuestDriver({
                      ...guestDriver,
                      name: event.target.value,
                    })
                  }
                />
              </div>

              <div className="daily-entry-input">
                <Phone size={17} />

                <input
                  type="tel"
                  placeholder="شماره تماس"
                  value={guestDriver.phone}
                  onChange={(event) =>
                    setGuestDriver({
                      ...guestDriver,
                      phone: event.target.value,
                    })
                  }
                />
              </div>

              <div className="daily-entry-input">
                <Truck size={17} />

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

                  {vehicleTypes.map((vehicle) => (
                    <option
                      key={vehicle.value}
                      value={vehicle.value}
                    >
                      {vehicle.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="daily-entry-add"
                onClick={addGuestDriver}
              >
                <Plus size={17} />
                ثبت ورود
              </button>
            </div>
          </div>
        )}

        <div className="daily-entry-list">
          <div className="daily-entry-list-header">
            <div>
              <h3>
                رانندگان ثبت‌شده امروز
              </h3>

              <p>
                {dailyDrivers.length} راننده برای امروز
                ثبت شده است.
              </p>
            </div>

            {dailyDrivers.length > 0 && (
              <button
                type="button"
                className="daily-entry-reset"
                onClick={resetToday}
              >
                <RotateCcw size={14} />
                پاک کردن ورود امروز
              </button>
            )}
          </div>

          {dailyDrivers.length === 0 ? (
            <div className="daily-entry-empty">
              <Users size={34} />

              <strong>
                هنوز راننده‌ای ثبت نشده است
              </strong>

              <span>
                یک راننده اصلی یا مهمان را از بالا
                ثبت کنید.
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
                  {dailyDrivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>
                        <div className="daily-entry-name">
                          <div className="daily-entry-avatar">
                            <UserRound size={16} />
                          </div>

                          <div>
                            <strong>
                              {driver.name}
                            </strong>

                            <span>
                              {driver.driverId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>{driver.phone}</td>

                      <td>
                        <span>
                          {driver.vehicleType}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`daily-entry-type ${driver.type === "main"
                              ? "main"
                              : "guest"
                            }`}
                        >
                          {driver.type === "main"
                            ? "اصلی"
                            : "مهمان"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="daily-entry-remove"
                          onClick={() =>
                            removeDriver(driver.id)
                          }
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <div className="daily-entry-back">
        <Link href="/">
          <ArrowRight size={16} />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </main>
  );
}