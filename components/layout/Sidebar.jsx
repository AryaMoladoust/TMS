"use client";

import {
  LayoutDashboard,
  Users,
  Package,
  Building2,
  FileText,
  Monitor,
  BarChart3,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  {
    title: "صفحه اصلی",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "رانندگان",
    href: "/drivers",
    icon: Users,
  },
  {
    title: "بارها",
    href: "/loads",
    icon: Package,
  },
  {
    title: "شرکت‌ها",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "فاکتورها",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "نمایش لیست‌ها",
    href: "/display",
    icon: Monitor,
  },
  {
    title: "گزارشات",
    href: "/reports",
    icon: BarChart3,
  },
];

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  mobileOpen,
  onClose,
}) {

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : "sidebar-closed"
        } ${
          mobileOpen
            ? "sidebar-mobile-open"
            : ""
        }`}
      >
        {/* HEADER SIDEBAR */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">T</div>

            <div className="brand-text">
              <h2>سرویس حمل‌ونقل</h2>

              <span>
                سرویس حمل‌ونقل باربری
              </span>
            </div>
          </div>

          {/* دکمه بستن در بالای Sidebar */}
          <button
            className="sidebar-close-top"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="بستن منو"
            title="بستن منو"
          >
            <X size={20} />
          </button>

          {/* دکمه موبایل */}
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="بستن منو"
          >
            <X size={21} />
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">
            منوی اصلی
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                href={item.href}
                key={item.title}
                className={`nav-item ${
                  item.href === "/"
                    ? "nav-item-active"
                    : ""
                }`}
                title={item.title}
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                />

                <span>{item.title}</span>
              </a>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <a
            href="/settings"
            className="nav-item"
            title="تنظیمات"
          >
            <Settings
              size={21}
              strokeWidth={1.8}
            />

            <span>تنظیمات</span>
          </a>

          <div className="sidebar-footer">
            <div className="server-status-dot" />

            <div>
              <span>وضعیت سرور</span>
              <strong>متصل</strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}