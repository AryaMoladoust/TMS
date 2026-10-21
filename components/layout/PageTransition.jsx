"use client";

import { usePathname } from "next/navigation";

/*
 * Fades the page in whenever the route changes.
 * The key makes React mount a fresh wrapper per route, which replays the CSS
 * animation (.page-transition). Layout, sidebar and polling are untouched.
 */
export default function PageTransition({ children }) {
    const pathname = usePathname();

    return (
        <div key={pathname} className="page-transition">
            {children}
        </div>
    );
}
