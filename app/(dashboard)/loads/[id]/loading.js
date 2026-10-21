import { SkeletonDetails } from "@/components/ui/Skeleton";

export default function LoadDetailsLoading() {
    return (
        <main className="main-content">
            <SkeletonDetails cards={2} fields={6} />
        </main>
    );
}
