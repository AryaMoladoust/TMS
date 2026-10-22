
"use client";

import { Skeleton } from "@/components/ui/Skeleton";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  Users,
  Building2,
  ChevronLeft,
} from "lucide-react";

const statsConfig = [
  {
    key: "drivers",
    title: "رانندگان",
    description: "تعداد کل رانندگان",
    icon: Users,
    type: "blue",
    href: "/drivers",
  },
  {
    key: "companies",
    title: "شرکت‌ها",
    description: "شرکت‌های طرف قرارداد",
    icon: Building2,
    type: "purple",
    href: "/companies",
  },
];

export default function StatsCards() {
  const [counts, setCounts] = useState({
    drivers: null,
    companies: null,
  });

  const [loading, setLoading] = useState(true);

  const loadCounts = useCallback(async () => {
    try {
      const [driversResponse, companiesResponse] =
        await Promise.all([
          fetch("/api/drivers?page=1&limit=1", {
            cache: "no-store",
          }),
          fetch("/api/companies?page=1&limit=1", {
            cache: "no-store",
          }),
        ]);

      if (!driversResponse.ok || !companiesResponse.ok) {
        throw new Error("خطا در دریافت آمار داشبورد");
      }

      const [driversData, companiesData] =
        await Promise.all([
          driversResponse.json(),
          companiesResponse.json(),
        ]);

      if (!driversData.success || !companiesData.success) {
        throw new Error("دریافت آمار از سرور ناموفق بود");
      }

      setCounts({
        drivers: Number(
          driversData.pagination?.total ?? 0
        ),

        // تعداد کل شرکت‌ها، نه تعداد شرکت‌های صفحه اول
        companies: Number(
          companiesData.totalCompanies ??
          companiesData.pagination?.total ??
          0
        ),
      });
    } catch (error) {
      console.error("Stats cards fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();

    function handleSyncUpdate() {
      loadCounts();
    }

    window.addEventListener(
      "tms-sync-updated",
      handleSyncUpdate
    );

    window.addEventListener(
      "companies-data-updated",
      handleSyncUpdate
    );

    window.addEventListener(
      "drivers-data-updated",
      handleSyncUpdate
    );

    // بررسی دوره‌ای برای به‌روز ماندن آمار
    const interval = setInterval(loadCounts, 10000);

    return () => {
      window.removeEventListener(
        "tms-sync-updated",
        handleSyncUpdate
      );

      window.removeEventListener(
        "companies-data-updated",
        handleSyncUpdate
      );

      window.removeEventListener(
        "drivers-data-updated",
        handleSyncUpdate
      );

      clearInterval(interval);
    };
  }, [loadCounts]);

  return (
    <section className="dash-stats" aria-label="آمار کلی">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;

        const count = counts[stat.key];

        const value =
          loading || count === null
            ? <Skeleton width={64} height={32} radius={8} />
            : count.toLocaleString("fa-IR");

        return (
          <Link
            href={stat.href}
            className="dash-stat"
            key={stat.key}
          >
            <div className={`dash-stat-icon dash-stat-icon-${stat.type}`}>
              <Icon size={28} />
            </div>

            <div className="dash-stat-body">
              <span>{stat.title}</span>

              <strong>{value}</strong>

              <small>{stat.description}</small>
            </div>

            <ChevronLeft size={22} className="dash-stat-go" />
          </Link>
        );
      })}
    </section>
  );
}
