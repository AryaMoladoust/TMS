"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Users,
  UserCheck,
} from "lucide-react";

import DriverSearch from "@/components/drivers/DriverSearch";
import DriverTable from "@/components/drivers/DriverTable";

/* =========================================================
   تبدیل اعداد فارسی و عربی به انگلیسی
========================================================= */

function normalizeDigits(value) {
  return String(value)
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );
}

/* =========================================================
   تبدیل تاریخ شمسی به شماره روز
========================================================= */

function jalaliToDayNumber(year, month, day) {
  const epBase =
    year - (year >= 0 ? 474 : 473);

  const epYear =
    474 + (epBase % 2820);

  const monthDays =
    month <= 7
      ? 31 * (month - 1)
      : 30 * (month - 1) + 6;

  return (
    day +
    monthDays +
    Math.floor(
      (epYear * 682 - 110) / 2816
    ) +
    (epYear - 1) * 365 +
    Math.floor(epBase / 2820) * 1029983 +
    1948319
  );
}

/* =========================================================
   تاریخ شمسی امروز
========================================================= */

function getTodayJalali() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat(
    "en-US-u-ca-persian",
    {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(now);

  return {
    year: Number(
      parts.find(
        (part) => part.type === "year"
      )?.value
    ),

    month: Number(
      parts.find(
        (part) => part.type === "month"
      )?.value
    ),

    day: Number(
      parts.find(
        (part) => part.type === "day"
      )?.value
    ),
  };
}

/* =========================================================
   تبدیل تاریخ انقضای گواهینامه به شماره روز
========================================================= */

function getLicenseExpiryNumber(
  licenseExpiry
) {
  if (!licenseExpiry) {
    return null;
  }

  const normalized = normalizeDigits(
    licenseExpiry
  )
    .trim()
    .replace(/-/g, "/");

  const match = normalized.match(
    /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    year < 1200 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return jalaliToDayNumber(
    year,
    month,
    day
  );
}

/* =========================================================
   صفحه رانندگان
========================================================= */

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    vehicleType: "",
    licenseStatus: "",
  });

  useEffect(() => {
    async function loadDrivers() {
      try {
        const response = await fetch(
          "/api/drivers",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          setDrivers(
            data.drivers || []
          );
        }
      } catch (error) {
        console.error(
          "خطا در دریافت رانندگان:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, []);

  /* =======================================================
     رانندگان معتبر

     فعلاً منطق قبلی دست نخورده
  ======================================================= */

  const availableDrivers =
    useMemo(() => {
      return drivers.filter(
        (driver) => {
          if (!driver.licenseExpiry) {
            return true;
          }

          return true;
        }
      );
    }, [drivers]);

  /* =======================================================
     مرتب‌سازی رانندگان بر اساس تاریخ انقضا

     1. منقضی‌ها
     2. نزدیک‌ترین انقضاها
     3. دورترین انقضاها
     4. بدون تاریخ انقضا در انتها
  ======================================================= */

  const sortedDrivers =
    useMemo(() => {
      const today =
        getTodayJalali();

      const todayNumber =
        jalaliToDayNumber(
          today.year,
          today.month,
          today.day
        );

      return [...drivers].sort(
        (a, b) => {
          const aExpiry =
            getLicenseExpiryNumber(
              a.licenseExpiry
            );

          const bExpiry =
            getLicenseExpiryNumber(
              b.licenseExpiry
            );

          /* بدون تاریخ انقضا → آخر */
          if (
            aExpiry === null &&
            bExpiry === null
          ) {
            return 0;
          }

          if (aExpiry === null) {
            return 1;
          }

          if (bExpiry === null) {
            return -1;
          }

          const aDays =
            aExpiry - todayNumber;

          const bDays =
            bExpiry - todayNumber;

          /*
             هر دو منقضی هستند:
             نزدیک‌ترین انقضا به امروز اول باشد.

             مثال:
             -1 روز
             -5 روز

             اول -1 می‌آید.
          */
          if (
            aDays < 0 &&
            bDays < 0
          ) {
            return (
              bDays - aDays
            );
          }

          /*
             منقضی‌ها همیشه قبل از معتبرها
          */
          if (
            aDays < 0 &&
            bDays >= 0
          ) {
            return -1;
          }

          if (
            aDays >= 0 &&
            bDays < 0
          ) {
            return 1;
          }

          /*
             هر دو معتبر:
             نزدیک‌ترین تاریخ انقضا اول
          */
          return aDays - bDays;
        }
      );
    }, [drivers]);

  return (
    <main className="main-content">
      {/* =========================
          Header
      ========================= */}

      <div className="page-heading page-heading-with-action">
        <div>
          <h1>رانندگان</h1>

          <p>
            مدیریت، جستجو و مشاهده اطلاعات رانندگان
          </p>
        </div>

        <Link
          href="/drivers/add"
          className="primary-action-button"
        >
          <Plus size={19} />

          <span>
            افزودن راننده
          </span>
        </Link>
      </div>

      {/* =========================
          Stats
      ========================= */}

      <section className="driver-stats-grid">
        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-blue">
            <Users size={22} />
          </div>

          <div>
            <span>
              کل رانندگان
            </span>

            <strong>
              {drivers.length}
            </strong>
          </div>
        </div>

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>
              رانندگان معتبر
            </span>

            <strong>
              {availableDrivers.length}
            </strong>
          </div>
        </div>
      </section>

      {/* =========================
          Search / Filters
      ========================= */}

      <DriverSearch
        filters={filters}
        setFilters={setFilters}
      />

      {/* =========================
          Drivers Table
      ========================= */}

      {loading ? (
        <div className="driver-loading">
          در حال دریافت لیست رانندگان...
        </div>
      ) : (
        <DriverTable
          drivers={sortedDrivers}
          filters={filters}
        />
      )}
    </main>
  );
}