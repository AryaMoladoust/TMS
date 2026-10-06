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

import { useNotification } from "@/components/ui/NotificationProvider";

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


  /* =====================================================
     رانندگان صفحه فعلی
  ===================================================== */

  const [totalDrivers, setTotalDrivers] =
    useState(0);
const [drivers, setDrivers] =
  useState([]);
  /* =====================================================
     Loading
  ===================================================== */

  const [loading, setLoading] =
    useState(true);

  /* =====================================================
     شماره صفحه فعلی
  ===================================================== */

  const [currentPage, setCurrentPage] =
    useState(1);

  /* =====================================================
     Pagination
  ===================================================== */

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  /* =====================================================
     فیلترها
  ===================================================== */

  const [filters, setFilters] =
    useState({
      search: "",
      vehicleType: "",
      licenseStatus: "",
    });

  const { showError } =
    useNotification();

  /* =====================================================
     دریافت رانندگان از API
  ===================================================== */

  async function loadDrivers({
    page = currentPage,
    showLoading = false,
    showNotificationOnError = false,
  } = {}) {

    try {

      if (showLoading) {
        setLoading(true);
      }

      const params =
        new URLSearchParams();

      /* ==============================
         Pagination
      ============================== */

      params.set(
        "page",
        String(page)
      );

      params.set(
        "limit",
        "50"
      );

      /* ==============================
         جستجوی سمت سرور
         جستجو در تمام دیتابیس
      ============================== */

      const search =
        filters.search?.trim();

      if (search) {
        params.set(
          "search",
          search
        );
      }

      /* ==============================
         درخواست API
      ============================== */

      const response =
        await fetch(
          `/api/drivers?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          data?.error ||
          "خطا در دریافت رانندگان"
        );
      }

      /* ==============================
         رانندگان صفحه فعلی
      ============================== */

      setDrivers(
        Array.isArray(data.drivers)
          ? data.drivers
          : []
      );
      if (!filters.search?.trim()) {
        setTotalDrivers(
          data.pagination?.total || 0
        );
      }

      /* ==============================
         Pagination
      ============================== */

      if (data.pagination) {

        setPagination(
          data.pagination
        );

      }

    } catch (error) {

      console.error(
        "خطا در دریافت رانندگان:",
        error
      );

      /*
        در Polling خطا نمایش نده،
        چون در صورت قطع موقت سرور
        کاربر مدام Toast دریافت نمی‌کند.
      */

      if (showNotificationOnError) {

        showError(
          error.message ||
          "خطا در دریافت لیست رانندگان",
          "خطا در دریافت رانندگان"
        );

      }

    } finally {

      if (showLoading) {
        setLoading(false);
      }

    }
  }

  /* =====================================================
     دریافت اولیه
  ===================================================== */

  useEffect(() => {

    loadDrivers({
      page: 1,
      showLoading: true,
      showNotificationOnError: true,
    });

  }, []);

  /* =====================================================
     وقتی صفحه تغییر کند
  ===================================================== */

  useEffect(() => {

    if (currentPage === 1) {
      return;
    }

    loadDrivers({
      page: currentPage,
      showLoading: true,
      showNotificationOnError: true,
    });

  }, [currentPage]);

  /* =====================================================
     جستجو
     
     وقتی متن جستجو تغییر کند:
     - صفحه به ۱ برمی‌گردد
     - API دوباره اجرا می‌شود
     - جستجو در کل MongoDB انجام می‌شود
  ===================================================== */

  useEffect(() => {

    const searchTimer =
      setTimeout(() => {

        /*
          اگر همین الان صفحه ۱ هستیم،
          مستقیماً جستجوی جدید را اجرا کن.
        */

        if (currentPage === 1) {

          loadDrivers({
            page: 1,
            showLoading: true,
            showNotificationOnError: false,
          });

        } else {

          /*
            ابتدا برگرد به صفحه اول.
            useEffect مربوط به currentPage
            درخواست جدید را اجرا می‌کند.
          */

          setCurrentPage(1);

        }

      }, 350);

    return () => {
      clearTimeout(searchTimer);
    };

  }, [filters.search]);

  /* =====================================================
     Sync فوری بعد از افزودن / ویرایش / حذف
  ===================================================== */

  useEffect(() => {

    function handleDriversUpdate() {

      loadDrivers({
        page: currentPage,
        showLoading: false,
        showNotificationOnError: false,
      });

    }

    window.addEventListener(
      "drivers-data-updated",
      handleDriversUpdate
    );

    return () => {

      window.removeEventListener(
        "drivers-data-updated",
        handleDriversUpdate
      );

    };

  }, [currentPage, filters.search]);

  /* =====================================================
     Polling
     
     هر 10 ثانیه فقط صفحه فعلی
     و جستجوی فعلی دوباره دریافت می‌شود.
  ===================================================== */

  useEffect(() => {

    const pollingInterval =
      setInterval(() => {

        loadDrivers({
          page: currentPage,
          showLoading: false,
          showNotificationOnError: false,
        });

      }, 10000);

    return () => {

      clearInterval(
        pollingInterval
      );

    };

  }, [currentPage, filters.search]);

  /* =====================================================
     رانندگان معتبر
     
     منطق قبلی دست نخورده:
     راننده در صورت داشتن/نداشتن تاریخ انقضا
     در لیست معتبر قرار می‌گیرد.
     
     چون Pagination داریم، تعداد صفحه فعلی
     ملاک "کل رانندگان" نیست.
  ===================================================== */

  const availableDrivers =
    useMemo(() => {

      return drivers.filter(
        (driver) => {

          if (
            !driver.licenseExpiry
          ) {
            return true;
          }

          return true;

        }
      );

    }, [drivers]);

  /* =====================================================
     مرتب‌سازی رانندگان بر اساس تاریخ انقضا
     
     1. منقضی‌ها
     2. نزدیک‌ترین انقضاها
     3. دورترین انقضاها
     4. بدون تاریخ انقضا در انتها
  ===================================================== */

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

          if (
            aExpiry === null
          ) {
            return 1;
          }

          if (
            bExpiry === null
          ) {
            return -1;
          }

          const aDays =
            aExpiry -
            todayNumber;

          const bDays =
            bExpiry -
            todayNumber;

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
              bDays -
              aDays
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

  /* =====================================================
     رفتن به صفحه بعد
  ===================================================== */

  function handleNextPage() {

    if (
      pagination.hasNextPage
    ) {

      setCurrentPage(
        (page) => page + 1
      );

    }

  }

  /* =====================================================
     رفتن به صفحه قبل
  ===================================================== */

  function handlePreviousPage() {

    if (
      pagination.hasPreviousPage
    ) {

      setCurrentPage(
        (page) => page - 1
      );

    }

  }

  /* =====================================================
     UI
  ===================================================== */

  return (

    <main className="main-content">

      {/* =========================
          Header
      ========================= */}

      <div className="page-heading page-heading-with-action">

        <div>

          <h1>
            رانندگان
          </h1>

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

        {/* کل رانندگان */}

        <div className="driver-stat-card">

          <div className="driver-stat-icon driver-stat-blue">

            <Users size={22} />

          </div>

          <div>

            <span>
              کل رانندگان
            </span>


              <strong>
                {totalDrivers.toLocaleString(
                  "fa-IR"
                )}
              </strong>

            

          </div>

        </div>

        {/* رانندگان معتبر */}

  

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

        <>

          <DriverTable
            drivers={sortedDrivers}
            filters={filters}
          />

          {/* =========================
              Pagination
          ========================= */}

          {pagination.totalPages > 1 && (

            <div
              className="drivers-pagination"
              dir="rtl"
            >

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage
                }
                onClick={
                  handlePreviousPage
                }
              >
                قبلی
              </button>

              <span>

                صفحه{" "}

                <strong>

                  {currentPage.toLocaleString(
                    "fa-IR"
                  )}

                </strong>

                {" "}از{" "}

                <strong>

                  {pagination.totalPages.toLocaleString(
                    "fa-IR"
                  )}

                </strong>

              </span>

              <button
                type="button"
                disabled={
                  !pagination.hasNextPage
                }
                onClick={
                  handleNextPage
                }
              >
                بعدی
              </button>

            </div>

          )}

        </>

      )}

    </main>

  );

}