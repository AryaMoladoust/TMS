
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  Building2,
  Phone,
  UserRound,
  Eye,
  Pencil,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const PAGE_SIZE = 50;

export default function CompanyTable({ search = "" }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // با تغییر عبارت جستجو، به صفحه اول برگرد.
  useEffect(() => {
    setPage(1);
  }, [search]);

  // دریافت اطلاعات صفحه جاری از API
  useEffect(() => {
    let cancelled = false;

    async function loadCompanies() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/companies?${params.toString()}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "خطا در دریافت شرکت‌ها"
          );
        }

        if (cancelled) return;

        const list = Array.isArray(data.companies)
          ? data.companies
          : [];

        // تعداد کل باید از API و countDocuments دریافت شود.
        const total = Number(data.pagination?.total ?? 0);
        const limit = Number(
          data.pagination?.limit ?? PAGE_SIZE
        );
        const totalPages = Number(
          data.pagination?.totalPages ??
            Math.ceil(total / limit)
        );

        const currentPage = Number(
          data.pagination?.page ?? page
        );

        setCompanies(list);

        setPagination({
          page: currentPage,
          limit,
          total,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        });
      } catch (err) {
        if (!cancelled) {
          console.error("Load companies error:", err);
          setError(
            err.message || "خطا در دریافت شرکت‌ها"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const debounceTimer = setTimeout(loadCompanies, 350);

    // دریافت مجدد اطلاعات هر ۱۰ ثانیه
    const pollingInterval = setInterval(() => {
      loadCompanies();
    }, 10000);

    function handleCompaniesUpdate() {
      loadCompanies();
    }

    window.addEventListener(
      "companies-data-updated",
      handleCompaniesUpdate
    );

    return () => {
      cancelled = true;
      clearTimeout(debounceTimer);
      clearInterval(pollingInterval);

      window.removeEventListener(
        "companies-data-updated",
        handleCompaniesUpdate
      );
    };
  }, [page, search, refreshKey]);

  const totalPages = Math.max(pagination.totalPages, 1);

  const startItem =
    pagination.total === 0
      ? 0
      : (page - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    page * PAGE_SIZE,
    pagination.total
  );

  function retryLoading() {
    setRefreshKey((current) => current + 1);
  }

  return (
    <section className="company-table-panel">
      <div className="company-table-header">
        <div>
          <h2>لیست شرکت‌ها</h2>
          <p>شرکت‌های ثبت شده در سیستم</p>
        </div>

        <span className="company-count-badge">
          {toPersianNumber(pagination.total)} شرکت
        </span>
      </div>

      <div className="company-table-wrapper">
        <table className="company-table">
          <thead>
            <tr>
              <th>شرکت</th>
              <th>نام مسئول</th>
              <th>شماره تماس</th>
              <th>تعداد بار</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  در حال دریافت اطلاعات شرکت‌ها...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#dc2626",
                  }}
                >
                  <p>{error}</p>

                  <button
                    type="button"
                    onClick={retryLoading}
                    style={{ marginTop: 12 }}
                  >
                    تلاش مجدد
                  </button>
                </td>
              </tr>
            )}

            {!loading && !error && companies.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  {search.trim()
                    ? "شرکتی با این مشخصات پیدا نشد."
                    : "هنوز هیچ شرکتی ثبت نشده است."}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              companies.map((company) => (
                <tr key={company._id}>
                  <td>
                    <div className="company-table-name">
                      <div className="company-table-icon">
                        <Building2 size={20} />
                      </div>

                      <div>
                        <strong>{company.name}</strong>
                        <span>{company._id}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="company-manager">
                      <UserRound size={17} />
                      <span>
                        {company.managerName || "—"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="company-phone">
                      <Phone size={16} />
                      <span>{company.phone || "—"}</span>
                    </div>
                  </td>

                  <td>
                    <strong className="company-load-count">
                      {toPersianNumber(0)} بار
                    </strong>
                  </td>

                  <td>
                    <div className="company-actions">
                      <Link
                        href={`/companies/${company._id}`}
                        className="company-action-button"
                        title="مشاهده"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        href={`/companies/${company._id}`}
                        className="company-action-button"
                        title="ویرایش"
                      >
                        <Pencil size={17} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!loading && !error && (
        <div className="company-table-footer">
          <span>
            نمایش {toPersianNumber(startItem)} تا{" "}
            {toPersianNumber(endItem)} از{" "}
            {toPersianNumber(pagination.total)} شرکت
          </span>

          <div className="company-pagination">
            <button
              type="button"
              className="company-pagination-button"
              disabled={page <= 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              aria-label="صفحه قبلی"
            >
              <ChevronRight size={18} />
              قبلی
            </button>

            <span className="company-pagination-info">
              صفحه {toPersianNumber(page)} از{" "}
              {toPersianNumber(totalPages)}
            </span>

            <button
              type="button"
              className="company-pagination-button"
              disabled={
                page >= pagination.totalPages ||
                pagination.totalPages === 0
              }
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    current + 1,
                    pagination.totalPages
                  )
                )
              }
              aria-label="صفحه بعدی"
            >
              بعدی
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function toPersianNumber(number) {
  return String(number).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}