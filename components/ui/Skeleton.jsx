/*
 * Skeleton loaders (shimmer placeholders).
 * Pure presentation: no data, no state. The styles live in globals.css
 * under "SKELETONS + PAGE TRANSITIONS".
 */

// Fixed widths (no Math.random) so server and client always render the same HTML.
const WIDTHS = [72, 56, 84, 48, 66, 60, 78, 52];

export function Skeleton({
    width,
    height = 14,
    radius,
    className = "",
    style,
}) {
    return (
        <span
            className={`skeleton ${className}`.trim()}
            style={{ width, height, borderRadius: radius, ...style }}
            aria-hidden="true"
        />
    );
}

function SkeletonRegion({
    className = "",
    label = "در حال دریافت اطلاعات...",
    children,
}) {
    return (
        <div
            className={className}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <span className="sk-sr-only">{label}</span>
            {children}
        </div>
    );
}

/* One table row. Can also be used inside a <td colSpan>. */
export function SkeletonRow({ cols = 5, seed = 0 }) {
    return (
        <div className="sk-tr" style={{ "--sk-cols": cols }}>
            {Array.from({ length: cols }).map((_, i) => (
                <div className="sk-td" key={i}>
                    <Skeleton
                        width={`${WIDTHS[(i + seed) % WIDTHS.length]}%`}
                        height={12}
                    />
                </div>
            ))}
        </div>
    );
}

/* Table placeholder. `bare` = no card around it (when the page already has one). */
export function SkeletonTable({ rows = 6, cols = 5, bare = false }) {
    return (
        <SkeletonRegion className={bare ? "sk-table" : "sk-card sk-table"}>
            {!bare && (
                <div className="sk-card-head">
                    <Skeleton width={150} height={18} />
                    <Skeleton width={84} height={12} />
                </div>
            )}

            <div
                className="sk-tr sk-thead"
                style={{ "--sk-cols": cols }}
            >
                {Array.from({ length: cols }).map((_, i) => (
                    <div className="sk-td" key={i}>
                        <Skeleton width="46%" height={10} />
                    </div>
                ))}
            </div>

            {Array.from({ length: rows }).map((_, r) => (
                <SkeletonRow key={r} cols={cols} seed={r} />
            ))}
        </SkeletonRegion>
    );
}

/* Row of stat cards. */
export function SkeletonStats({ count = 4 }) {
    return (
        <SkeletonRegion className="sk-stats">
            {Array.from({ length: count }).map((_, i) => (
                <div className="sk-card sk-stat" key={i}>
                    <Skeleton width={46} height={46} radius={14} />

                    <div className="sk-stat-text">
                        <Skeleton width="55%" height={11} />
                        <Skeleton width="38%" height={22} />
                    </div>
                </div>
            ))}
        </SkeletonRegion>
    );
}

/* List with avatars (daily drivers, display screen ...). */
export function SkeletonList({ rows = 4 }) {
    return (
        <SkeletonRegion className="sk-list">
            {Array.from({ length: rows }).map((_, i) => (
                <div className="sk-list-item" key={i}>
                    <Skeleton width={44} height={44} radius={14} />

                    <div className="sk-list-text">
                        <Skeleton
                            width={`${WIDTHS[i % WIDTHS.length]}%`}
                            height={13}
                        />
                        <Skeleton width="34%" height={10} />
                    </div>

                    <Skeleton width={62} height={24} radius={999} />
                </div>
            ))}
        </SkeletonRegion>
    );
}

/* Page title (back link, title, subtitle). */
export function SkeletonHeading({ action = false }) {
    return (
        <div className="sk-heading" aria-hidden="true">
            <div className="sk-heading-text">
                <Skeleton width={190} height={28} radius={10} />
                <Skeleton width={290} height={12} />
            </div>

            {action && <Skeleton width={140} height={44} radius={12} />}
        </div>
    );
}

/* Details page: a few cards of label/value pairs. */
export function SkeletonDetails({ cards = 2, fields = 6 }) {
    return (
        <SkeletonRegion className="sk-details">
            <SkeletonHeading action />

            <div className="sk-details-grid">
                {Array.from({ length: cards }).map((_, c) => (
                    <div className="sk-card" key={c}>
                        <div className="sk-card-head">
                            <Skeleton width={130} height={18} />
                        </div>

                        <div className="sk-fields">
                            {Array.from({ length: fields }).map((_, i) => (
                                <div className="sk-field" key={i}>
                                    <Skeleton width="38%" height={10} />
                                    <Skeleton
                                        width={`${WIDTHS[(i + c) % WIDTHS.length]}%`}
                                        height={14}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SkeletonRegion>
    );
}

/* Form page: inputs in a grid + a button. */
export function SkeletonForm({ fields = 6 }) {
    return (
        <SkeletonRegion className="sk-details">
            <SkeletonHeading />

            <div className="sk-card">
                <div className="sk-card-head">
                    <Skeleton width={150} height={18} />
                </div>

                <div className="sk-fields sk-form-grid">
                    {Array.from({ length: fields }).map((_, i) => (
                        <div className="sk-field" key={i}>
                            <Skeleton width="30%" height={10} />
                            <Skeleton height={46} radius={12} />
                        </div>
                    ))}
                </div>

                <Skeleton width={150} height={46} radius={12} />
            </div>
        </SkeletonRegion>
    );
}

/* Generic page: used by app/(dashboard)/loading.js while a route is opening. */
export function PageSkeleton() {
    return (
        <>
            <SkeletonHeading action />
            <SkeletonStats count={3} />
            <SkeletonTable rows={6} cols={5} />
        </>
    );
}
