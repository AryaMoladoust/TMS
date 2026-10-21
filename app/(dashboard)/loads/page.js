"use client";

import { SkeletonStats, SkeletonTable } from "@/components/ui/Skeleton";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Plus, Package } from "lucide-react";

import LoadsBoard from "@/components/loads/LoadsBoard";
import { useNotification } from "@/components/ui/NotificationProvider";

const PAGE_LIMIT = 50;

// =====================================
// صفحه بارها
// =====================================

export default function LoadsPage() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  // فیلترها
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  const { showError } = useNotification();

  // آخرین مقدار فیلترها: Polling همیشه صفحه و فیلتر فعلی را می‌گیرد
  // بدون اینکه useEffect مربوط به Polling تغییر کند
  const queryRef = useRef({});

  queryRef.current = {
    page,
    search: debouncedSearch,
    barType: typeFilter,
    vehicleType: vehicleFilter,
  };

  // جلوگیری از اعمال پاسخ‌های قدیمی
  const requestIdRef = useRef(0);
  const isFirstRender = useRef(true);

  // =====================================
  // دریافت بارها
  // =====================================

  async function loadLoads({
    showLoading = false,
    showNotificationOnError = false,
  } = {}) {
    const requestId = ++requestIdRef.current;

    try {
      if (showLoading) {
        setLoading(true);
      }

      const q = queryRef.current;

      const params = new URLSearchParams({
        page: String(q.page),
        limit: String(PAGE_LIMIT),
      });

      if (q.search) params.set("search", q.search);
      if (q.barType) params.set("barType", q.barType);
      if (q.vehicleType) params.set("vehicleType", q.vehicleType);

      const response = await fetch(`/api/loads?${params.toString()}`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "خطا در دریافت بارها"
        );
      }

      // پاسخ قدیمی را نادیده بگیر
      if (requestId !== requestIdRef.current) {
        return;
      }

      const nextLoads = Array.isArray(data) ? data : data?.loads || [];

      setLoads(nextLoads);

      if (data?.pagination) {
        setPagination(data.pagination);

        // اگر سرور شماره صفحه را اصلاح کرد (مثلاً بعد از حذف بار)
        if (data.pagination.page !== q.page) {
          setPage(data.pagination.page);
        }
      }
    } catch (error) {
      console.error("Load loads error:", error);

      // در Polling خطا را مدام نمایش نمی‌دهیم
      if (showNotificationOnError) {
        showError(
          error.message || "خطا در دریافت لیست بارها",
          "خطا در دریافت بارها"
        );
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  // =====================================
  // Debounce جستجو
  // =====================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // =====================================
  // دریافت اولیه + Polling (بدون تغییر)
  // =====================================

  useEffect(() => {
    // دریافت اولیه
    loadLoads({
      showLoading: true,
      showNotificationOnError: true,
    });

    // هر ۵ ثانیه بررسی دیتابیس
    const pollingInterval = setInterval(() => {
      loadLoads({
        showLoading: false,
        showNotificationOnError: false,
      });
    }, 5000);

    // بروزرسانی فوری بعد از تغییر بار
    function handleLoadsUpdate() {
      loadLoads({
        showLoading: false,
        showNotificationOnError: false,
      });
    }

    window.addEventListener("loads-data-updated", handleLoadsUpdate);

    // Cleanup
    return () => {
      clearInterval(pollingInterval);

      window.removeEventListener("loads-data-updated", handleLoadsUpdate);
    };
  }, []);

  // =====================================
  // دریافت مجدد با تغییر صفحه / جستجو / فیلتر
  // =====================================

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    loadLoads({
      showLoading: false,
      showNotificationOnError: true,
    });
  }, [page, debouncedSearch, typeFilter, vehicleFilter]);

  // =====================================
  // هندلرها (با تغییر فیلتر، برگرد به صفحه ۱)
  // =====================================

  function handleSearchChange(value) {
    setSearchTerm(value);
    setPage(1);
  }

  function handleTypeChange(value) {
    setTypeFilter(value);
    setPage(1);
  }

  function handleVehicleChange(value) {
    setVehicleFilter(value);
    setPage(1);
  }

  function handleReset() {
    setSearchTerm("");
    setDebouncedSearch("");
    setTypeFilter("");
    setVehicleFilter("");
    setPage(1);
  }

  const isFiltering =
    Boolean(searchTerm.trim()) ||
    Boolean(typeFilter) ||
    Boolean(vehicleFilter);

  // =====================================
  // Loading اولیه
  // =====================================

  if (loading) {
    return (
      <main className="main-content">
        <div className="page-heading page-heading-with-action">
          <div>
            <h1>بارها</h1>

            <p>مدیریت و مشاهده وضعیت بارهای ثبت شده</p>
          </div>

          <Link href="/loads/add" className="primary-action-button">
            <Plus size={19} />

            <span>افزودن بار</span>
          </Link>
        </div>

        <SkeletonStats count={1} />

        <SkeletonTable rows={7} cols={6} />
      </main>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <main className="main-content">
      {/* Page Header */}
      <div className="page-heading page-heading-with-action">
        <div>
          <h1>بارها</h1>

          <p>مدیریت و مشاهده وضعیت بارهای ثبت شده</p>
        </div>

        <Link href="/loads/add" className="primary-action-button">
          <Plus size={19} />

          <span>افزودن بار</span>
        </Link>
      </div>

      {/* Statistics */}
      <section className="load-stats-grid">
        <div className="load-stat-card">
          <div className="load-stat-icon load-stat-blue">
            <Package size={22} />
          </div>

          <div>
            <span>{isFiltering ? "نتایج فیلتر" : "کل بارها"}</span>

            <strong>{pagination.total.toLocaleString("fa-IR")}</strong>
          </div>
        </div>
      </section>

      {/* Search + Table */}
      <LoadsBoard
        loads={loads}
        pagination={pagination}
        onPageChange={setPage}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        vehicleFilter={vehicleFilter}
        onVehicleChange={handleVehicleChange}
        onReset={handleReset}
      />
    </main>
  );
}
