import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import AvailableDrivers from "@/components/dashboard/AvailableDrivers";
import LoadsList from "@/components/dashboard/LoadsList";
import InvoiceSummary from "@/components/dashboard/InvoiceSummary";

export default function DashboardPage() {
  return (
    <main className="main-content">
      <div className="page-heading">
        <h1>صفحه اصلی</h1>

        <p>
          نمای کلی از وضعیت سرویس حمل‌ونقل
          باربری
        </p>
      </div>

      <StatsCards />

      <QuickActions />

      <div className="dashboard-grid">
        <AvailableDrivers />
        <LoadsList />
      </div>

      <InvoiceSummary />
    </main>
  );
}