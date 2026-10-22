import Link from "next/link";

import {
  ChevronLeft,
  Users,
  Package,
  Building2,
  FileText,
  UserCheck,
} from "lucide-react";

// سه کار اصلی روزانه بزرگ‌تر نمایش داده می‌شوند
const actions = [
  {
    title: "ورود روزانه رانندگان",
    description: "ثبت رانندگانی که امروز آمده‌اند",
    icon: UserCheck,
    href: "/daily-drivers",
    type: "teal",
    primary: true,
  },
  {
    title: "افزودن بار",
    description: "ثبت یک بار جدید",
    icon: Package,
    href: "/loads/add",
    type: "orange",
    primary: true,
  },
  {
    title: "ثبت فاکتور",
    description: "صدور فاکتور برای بار",
    icon: FileText,
    href: "/invoices/add",
    type: "green",
    primary: true,
  },
  {
    title: "افزودن راننده",
    description: "ثبت راننده جدید در سیستم",
    icon: Users,
    href: "/drivers/add",
    type: "blue",
  },
  {
    title: "افزودن شرکت",
    description: "ثبت شرکت طرف قرارداد",
    icon: Building2,
    href: "/companies/add",
    type: "purple",
  },
];

export default function QuickActions() {
  return (
    <section className="dash-section">
      <div className="dash-section-head">
        <h2>کارهای روزانه</h2>

        <p>برای شروع روی یکی از دکمه‌ها بزنید</p>
      </div>

      <div className="dash-actions">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              href={action.href}
              className={`dash-action ${
                action.primary ? "" : "dash-action-secondary"
              }`}
              key={action.title}
            >
              <div
                className={`dash-action-icon dash-action-icon-${action.type}`}
              >
                <Icon size={30} strokeWidth={1.9} />
              </div>

              <div className="dash-action-text">
                <span className="dash-action-title">{action.title}</span>

                <span className="dash-action-desc">
                  {action.description}
                </span>
              </div>

              <ChevronLeft size={24} className="dash-action-go" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
