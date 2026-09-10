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
          mobileOpen
            ? "sidebar-mobile-open"
            : ""
        }`}
      >
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">
              T
            </div>

            <div>
              <h2>TMS</h2>

              <span>
                سیستم حمل‌ونقل
              </span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>

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
              >
                <Icon
                  size={20}
                  strokeWidth={1.8}
                />

                <span>
                  {item.title}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <a
            href="/settings"
            className="nav-item"
          >
            <Settings size={20} />

            <span>
              تنظیمات
            </span>
          </a>

          <div className="sidebar-footer">
            <div className="server-status-dot" />

            <div>
              <span>
                وضعیت سرور
              </span>

              <strong>
                متصل
              </strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}