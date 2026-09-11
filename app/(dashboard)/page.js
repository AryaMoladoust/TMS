import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import DailyDriversList from "@/components/dashboard/DailyDriversList";

export default function DashboardPage() {
  return (
    <main className="main-content">

      <div className="page-heading">
        <h1>صفحه اصلی</h1>

        <p>
          مدیریت روزانه سرویس حمل‌ونقل باربری
        </p>
      </div>

      <StatsCards />

      <QuickActions />

      <DailyDriversList />

    </main>
  );
}