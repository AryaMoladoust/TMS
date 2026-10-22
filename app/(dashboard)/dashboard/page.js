import StatsCards from "@/components/dashboard/StatsCards";
import QuickActions from "@/components/dashboard/QuickActions";
import DailyDriversList from "@/components/dashboard/DailyDriversList";
import DeliveryScene from "@/components/dashboard/DeliveryScene";

export default function DashboardPage() {
  return (
    <main className="main-content dash-page">

      <DeliveryScene />

      <QuickActions />

      <StatsCards />

      <DailyDriversList />

    </main>
  );
}
