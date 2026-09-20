"use client";

import Link from "next/link";
import { Eye, Pencil, UserRound } from "lucide-react";

/* =========================
   تبدیل اعداد فارسی به انگلیسی
========================= */
function convertToEnglishNumbers(value) {
  if (!value) return "";

  return String(value).replace(/[۰-۹]/g, (digit) => {
    return String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
  });
}

/* =========================
   تبدیل تاریخ شمسی به Julian Day
========================= */
function jalaliToJulianDay(year, month, day) {
  const epBase = year - (year >= 0 ? 474 : 473);
  const epYear = 474 + (epBase % 2820);

  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6) +
    Math.floor((epYear * 682 - 110) / 2816) +
    (epYear - 1) * 365 +
    Math.floor(epBase / 2820) * 1029983 +
    (1948320.5 - 1)
  );
}

/* =========================
   دریافت تاریخ امروز شمسی
========================= */
function getTodayJalali() {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(
    convertToEnglishNumbers(
      parts.find((part) => part.type === "year")?.value
    )
  );

  const month = Number(
    convertToEnglishNumbers(
      parts.find((part) => part.type === "month")?.value
    )
  );

  const day = Number(
    convertToEnglishNumbers(
      parts.find((part) => part.type === "day")?.value
    )
  );

  return {
    year,
    month,
    day,
  };
}

/* =========================
   وضعیت اعتبار گواهینامه
========================= */
function getLicenseStatus(licenseExpiry) {
  if (!licenseExpiry) {
    return {
      status: "warning",
      label: "تاریخ ثبت نشده",
    };
  }

  const normalizedDate = convertToEnglishNumbers(licenseExpiry)
    .replace(/-/g, "/")
    .trim();

  const parts = normalizedDate.split("/");

  if (parts.length !== 3) {
    return {
      status: "warning",
      label: "تاریخ نامعتبر",
    };
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return {
      status: "warning",
      label: "تاریخ نامعتبر",
    };
  }

  const today = getTodayJalali();

  const todayJulian = jalaliToJulianDay(
    today.year,
    today.month,
    today.day
  );

  const expiryJulian = jalaliToJulianDay(
    year,
    month,
    day
  );

  const daysRemaining = Math.round(expiryJulian - todayJulian);

  /* =========================
     تاریخ گذشته → نامعتبر
  ========================= */
  if (daysRemaining < 0) {
    return {
      status: "expired",
      label: "نامعتبر",
      daysRemaining,
    };
  }

  /* =========================
     ۱۴ روز یا کمتر مانده → نمایش تعداد روز باقی‌مانده
  ========================= */
  if (daysRemaining <= 14) {
    return {
      status: "warning",
      label:
        daysRemaining === 0
          ? "امروز منقضی می‌شود"
          : `${daysRemaining} روز مانده`,
      daysRemaining,
    };
  }

  /* =========================
     بیشتر از ۱۴ روز مانده → معتبر
  ========================= */
  return {
    status: "valid",
    label: "معتبر",
    daysRemaining,
  };
}

/* =========================
   نوع خودرو
========================= */
function getVehicleTypeLabel(type) {
  const vehicleTypes = {
    truck: "کامیون",
    trailer: "تریلی",
    pickup: "نیسان",
    van: "وانت",
  };

  return vehicleTypes[type] || type || "-";
}

/* =========================
   کامپوننت اصلی
========================= */
export default function DriverTable({ drivers, filters }) {
  const filteredDrivers = drivers.filter((driver) => {
    /* -------------------------
       جستجو
    ------------------------- */
    const searchValue = filters.search
      .trim()
      .toLowerCase();

    const matchesSearch =
      !searchValue ||
      driver.name?.toLowerCase().includes(searchValue) ||
      driver.nationalId?.includes(searchValue) ||
      driver.phone?.includes(searchValue);

    /* -------------------------
       نوع خودرو
    ------------------------- */
    const matchesVehicle =
      !filters.vehicleType ||
      driver.vehicleType === filters.vehicleType;

    /* -------------------------
       وضعیت گواهینامه
    ------------------------- */
    const licenseStatus = getLicenseStatus(
      driver.licenseExpiry
    );

    const matchesLicenseStatus =
      !filters.licenseStatus ||
      licenseStatus.status === filters.licenseStatus;

    return (
      matchesSearch &&
      matchesVehicle &&
      matchesLicenseStatus
    );
  });

  return (
    <section className="driver-table-section">
      <div className="driver-table-header">
        <div>
          <h2>لیست رانندگان</h2>
          <p>
            {filteredDrivers.length} راننده نمایش داده می‌شود
          </p>
        </div>
      </div>

      {filteredDrivers.length === 0 ? (
        <div className="driver-empty-state">
          <UserRound size={42} />
          <h3>راننده‌ای پیدا نشد</h3>
          <p>
            با تغییر فیلترها یا عبارت جستجو دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className="driver-table-wrapper">
          <table className="driver-table">
            <thead>
              <tr>
                <th>راننده</th>
                <th>کد ملی</th>
                <th>شماره موبایل</th>
                <th>نوع خودرو</th>
                <th>شماره پلاک</th>
                <th>تاریخ اعتبار گواهینامه</th>
                <th>وضعیت اعتبار</th>
                <th>عملیات</th>
              </tr>
            </thead>

            <tbody>
              {filteredDrivers.map((driver) => {
                const licenseStatus = getLicenseStatus(
                  driver.licenseExpiry
                );

                return (
                  <tr key={driver._id}>
                    {/* راننده */}
                    <td>
                      <div className="driver-name-cell">
                        <div className="driver-avatar">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <strong>{driver.name}</strong>
                        </div>
                      </div>
                    </td>

                    {/* کد ملی */}
                    <td>
                      {driver.nationalId || "-"}
                    </td>

                    {/* موبایل */}
                    <td>
                      {driver.phone || "-"}
                    </td>

                    {/* خودرو */}
                    <td>
                      {getVehicleTypeLabel(
                        driver.vehicleType
                      )}
                    </td>

                    {/* پلاک */}
                    <td>
                      {driver.vehiclePlate || "-"}
                    </td>

                    {/* تاریخ اعتبار */}
                    <td>
                      {driver.licenseExpiry || "-"}
                    </td>

                    {/* وضعیت اعتبار */}
                    <td>
                      <span
                        className={`driver-license-status driver-license-${licenseStatus.status}`}
                      >
                        <span className="driver-license-status-dot" />

                        {licenseStatus.label}
                      </span>
                    </td>

                    {/* عملیات */}
                    <td>
                      <div className="driver-table-actions">
                        <Link
                          href={`/drivers/${driver._id}`}
                          className="driver-table-action driver-view-action"
                          title="مشاهده جزئیات"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          href={`/drivers/${driver._id}/edit`}
                          className="driver-table-action driver-edit-action"
                          title="ویرایش راننده"
                        >
                          <Pencil size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
