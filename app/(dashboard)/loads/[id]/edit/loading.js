import { SkeletonForm } from "@/components/ui/Skeleton";

export default function EditLoadLoading() {
    return (
        <main className="main-content">
            <SkeletonForm fields={8} />
        </main>
    );
}
