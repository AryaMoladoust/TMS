"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Plus,
  Package,
} from "lucide-react";

import LoadsBoard from "@/components/loads/LoadsBoard";
import { useNotification } from "@/components/ui/NotificationProvider";


// =====================================
// صفحه بارها
// =====================================

export default function LoadsPage() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showError } = useNotification();


  // =====================================
  // دریافت بارها
  // =====================================

  async function loadLoads({
    showLoading = false,
    showNotificationOnError = false,
  } = {}) {
    try {
      if (showLoading) {
        setLoading(true);
      }

      const response = await fetch("/api/loads", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "خطا در دریافت بارها"
        );
      }

      // API ممکن است مستقیماً آرایه برگرداند
      // یا داخل loads قرار داده باشد
      const nextLoads = Array.isArray(data)
        ? data
        : data?.loads || [];

      setLoads(nextLoads);

    } catch (error) {
      console.error(
        "Load loads error:",
        error
      );

      // در Polling خطا را مدام نمایش نمی‌دهیم
      if (showNotificationOnError) {
        showError(
          error.message ||
            "خطا در دریافت لیست بارها",
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
  // دریافت اولیه + Polling
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


    // =====================================
    // بروزرسانی فوری بعد از تغییر بار
    // =====================================

    function handleLoadsUpdate() {
      loadLoads({
        showLoading: false,
        showNotificationOnError: false,
      });
    }

    window.addEventListener(
      "loads-data-updated",
      handleLoadsUpdate
    );


    // =====================================
    // Cleanup
    // =====================================

    return () => {
      clearInterval(pollingInterval);

      window.removeEventListener(
        "loads-data-updated",
        handleLoadsUpdate
      );
    };
  }, []);


  // =====================================
  // آمار
  // =====================================

  const totalLoads = loads.length;


  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <main className="main-content">

        <div className="page-heading page-heading-with-action">

          <div>
            <h1>بارها</h1>

            <p>
              مدیریت و مشاهده وضعیت بارهای ثبت شده
            </p>
          </div>


          <Link
            href="/loads/add"
            className="primary-action-button"
          >
            <Plus size={19} />

            <span>
              افزودن بار
            </span>
          </Link>

        </div>


        <section className="load-stats-grid">

          <div className="load-stat-card">

            <div className="load-stat-icon load-stat-blue">
              <Package size={22} />
            </div>


            <div>
              <span>
                کل بارها
              </span>

              <strong>
                —
              </strong>
            </div>

          </div>

        </section>


        <div
          style={{
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          در حال دریافت بارها...
        </div>

      </main>
    );
  }


  // =====================================
  // UI
  // =====================================

  return (
    <main className="main-content">

      {/* =====================================
          Page Header
      ====================================== */}

      <div className="page-heading page-heading-with-action">

        <div>

          <h1>
            بارها
          </h1>


          <p>
            مدیریت و مشاهده وضعیت بارهای ثبت شده
          </p>

        </div>


        <Link
          href="/loads/add"
          className="primary-action-button"
        >

          <Plus size={19} />

          <span>
            افزودن بار
          </span>

        </Link>

      </div>


      {/* =====================================
          Statistics
      ====================================== */}

      <section className="load-stats-grid">

        <div className="load-stat-card">

          <div className="load-stat-icon load-stat-blue">

            <Package size={22} />

          </div>


          <div>

            <span>
              کل بارها
            </span>


            <strong>
              {totalLoads}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================
          Search + Table
      ====================================== */}

      <LoadsBoard
        loads={loads}
      />

    </main>
  );
}