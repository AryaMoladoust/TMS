import {
  Users,
  Package,
  FileText,
  Building2,
  ArrowUpLeft,
} from "lucide-react";

const stats = [
  {
    title: "رانندگان",
    value: "۱۲۸",
    description: "تعداد کل رانندگان",
    icon: Users,
    type: "blue",
  },
  {
    title: "بارها",
    value: "۳۶",
    description: "بارهای ثبت شده",
    icon: Package,
    type: "orange",
  },
  {
    title: "فاکتورها",
    value: "۲۴",
    description: "فاکتورهای این ماه",
    icon: FileText,
    type: "green",
  },
  {
    title: "شرکت‌ها",
    value: "۱۸",
    description: "شرکت‌های طرف قرارداد",
    icon: Building2,
    type: "purple",
  },
];

export default function StatsCards() {
  return (
    <section className="stats-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div className="stat-card" key={stat.title}>
            <div className="stat-card-top">
              <div className={`stat-icon stat-icon-${stat.type}`}>
                <Icon size={22} />
              </div>

              <div className="stat-arrow">
                <ArrowUpLeft size={16} />
              </div>
            </div>

            <div className="stat-info">
              <span>{stat.title}</span>
              <strong>{stat.value}</strong>
              <small>{stat.description}</small>
            </div>
          </div>
        );
      })}
    </section>
  );
}