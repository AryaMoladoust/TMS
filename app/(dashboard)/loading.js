import { PageSkeleton } from "@/components/ui/Skeleton";

/*
 * Shown instantly while a dashboard route is opening
 * (after clicking a sidebar item), before the page itself is ready.
 */
export default function DashboardLoading() {
    return (
        <main className="main-content">
            <PageSkeleton />
        </main>
    );
}
