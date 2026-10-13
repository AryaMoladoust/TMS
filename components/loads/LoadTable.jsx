"use client";

import Link from "next/link";

import {
  Package,
  MapPin,
  ArrowLeft,
  Truck,
  Building2,
  Eye,
  Pencil,
} from "lucide-react";

// =====================================
// تبدیل نوع بار به فارسی
// =====================================

const barTypeData = {
  food: "مواد غذایی",
  industrial: "قطعات صنعتی",
  construction: "مصالح ساختمانی",
  agriculture: "محصولات کشاورزی",
  other: "سایر",
};

// =====================================
// تبدیل نوع خودرو به فارسی
// =====================================

const vehicleData = {
  truck: "کامیون",
  trailer: "تریلی",
  pickup: "نیسان",
  van: "وانت",
};

// =====================================
// تبدیل تاریخ به فارسی
// =====================================

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const loadDate = new Date(date);

  if (isNaN(loadDate.getTime())) {
    return "—";
  }

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  // امروز
  if (
    loadDate.getFullYear() === today.getFullYear() &&
    loadDate.getMonth() === today.getMonth() &&
    loadDate.getDate() === today.getDate()
  ) {
    return "امروز";
  }

  // دیروز
  if (
    loadDate.getFullYear() === yesterday.getFullYear() &&
    loadDate.getMonth() === yesterday.getMonth() &&
    loadDate.getDate() === yesterday.getDate()
  ) {
    return "دیروز";
  }

  // تاریخ فارسی
  return loadDate.toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// =====================================
// ساخت لیست شماره صفحات (با ...)
// =====================================

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push("...");

  pages.push(total);

  return pages;
}

// =====================================
// LoadTable
// =====================================

export default function LoadTable({
  loads = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange = () => {},
  emptyTitle = "هنوز هیچ باری ثبت نشده است",
  emptySubtitle = "برای شروع، یک بار جدید ثبت کنید.",
}) {
  // مرتب‌سازی (جدیدترین اول) و صفحه‌بندی سمت سرور انجام می‌شود
  const { page, limit, total, totalPages } = pagination;

  const fromItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const toItem = (page - 1) * limit + loads.length;

  return (
    <section className="load-table-panel">
      {/* Header */}
      <div className="load-table-header">
        <div>
          <h2>لیست بارها</h2>

          <p>جدیدترین بارها در ابتدا نمایش داده می‌شوند</p>
        </div>

        <span className="load-count-badge">
          {total.toLocaleString("fa-IR")}
          {" بار"}
        </span>
      </div>

      {/* Table */}
      <div className="load-table-wrapper">
        <table className="load-table">
          <thead>
            <tr>
              <th>بار</th>
              <th>شرکت</th>
              <th>مسیر</th>
              <th>راننده</th>
              <th>خودرو</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>
            {loads.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Package size={35} />

                    <strong>{emptyTitle}</strong>

                    <span>{emptySubtitle}</span>
                  </div>
                </td>
              </tr>
            ) : (
              loads.map((load) => {
                return (
                  <tr key={load._id}>
                    {/* Load */}
                    <td>
                      <div className="load-table-name">
                        <div className="load-table-icon">
                          <Package size={20} />
                        </div>

                        <div>
                          <strong>{load.title}</strong>

                          <span>
                            {barTypeData[load.barType] ||
                              load.barType ||
                              "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Company */}
                    <td>
                      <div className="load-company">
                        <Building2 size={16} />

                        <span>{load.companyName || "—"}</span>
                      </div>
                    </td>

                    {/* Route */}
                    <td>
                      <div className="load-route">
                        <div>
                          <MapPin size={14} />

                          <span>{load.origin}</span>
                        </div>

                        <ArrowLeft size={15} />

                        <div>
                          <MapPin size={14} />

                          <span>{load.destination}</span>
                        </div>
                      </div>
                    </td>

                    {/* Driver */}
                    <td>
                      <strong className="load-driver-name">
                        {load.driver || "—"}
                      </strong>
                    </td>

                    {/* Vehicle */}
                    <td>
                      <div className="load-vehicle">
                        <Truck size={16} />

                        {vehicleData[load.vehicleType] ||
                          load.vehicleType ||
                          "—"}
                      </div>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="load-date">
                        {formatDate(load.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="load-actions">
                        <Link
                          href={`/loads/${load._id}`}
                          className="load-action-button"
                          title="مشاهده"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          href={`/loads/${load._id}/edit`}
                          className="load-action-button"
                          title="ویرایش"
                        >
                          <Pencil size={17} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer + Pagination */}
      <div className="load-table-footer">
        <span>
          نمایش{" "}
          {total === 0
            ? "۰"
            : `${fromItem.toLocaleString("fa-IR")} تا ${toItem.toLocaleString("fa-IR")}`}
          {" از "}
          {total.toLocaleString("fa-IR")}
          {" بار"}
        </span>

        <div className="pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            قبلی
          </button>

          {getPageNumbers(page, totalPages).map((item, index) =>
            item === "..." ? (
              <span key={`dots-${index}`} style={{ padding: "0 6px" }}>
                …
              </span>
            ) : (
              <button
                type="button"
                key={item}
                className={item === page ? "pagination-active" : ""}
                onClick={() => onPageChange(item)}
              >
                {item.toLocaleString("fa-IR")}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            بعدی
          </button>
        </div>
      </div>
    </section>
  );
}
