import {
  Plus,
  Users,
  Package,
  Building2,
  FileText,
} from "lucide-react";

const actions = [
  {
    title: "افزودن راننده",
    icon: Users,
    href: "/drivers/add",
    type: "blue",
  },
  {
    title: "افزودن بار",
    icon: Package,
    href: "/loads/add",
    type: "orange",
  },
  {
    title: "افزودن شرکت",
    icon: Building2,
    href: "/companies/add",
    type: "purple",
  },
  {
    title: "ثبت فاکتور",
    icon: FileText,
    href: "/invoices/add",
    type: "green",
  },
];

export default function QuickActions() {
  return (
    <section className="quick-actions-section">
      <div className="section-heading">
        <div>
          <h2>دسترسی سریع</h2>
          <p>عملیات پرکاربرد سیستم</p>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <a
              href={action.href}
              className="quick-action-card"
              key={action.title}
            >
              <div className={`quick-action-icon quick-${action.type}`}>
                <Icon size={21} />
              </div>

              <span>{action.title}</span>

              <Plus size={18} className="quick-plus" />
            </a>
          );
        })}
      </div>
    </section>
  );
}