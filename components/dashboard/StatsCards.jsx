"use client";

import Link from "next/link";
import AnimatedTruck from "./AnimatedTruck";
import { useEffect, useState } from "react";
import {
    Users,
    Building2,
    ArrowUpLeft,
} from "lucide-react";

const statsConfig = [
    {
        key: "drivers",
        title: "رانندگان",
        description: "تعداد کل رانندگان",
        icon: Users,
        type: "blue",
        href: "/drivers",
    },
    {
        key: "companies",
        title: "شرکت‌ها",
        description: "شرکت‌های طرف قرارداد",
        icon: Building2,
        type: "purple",
        href: "/companies",
    },
];

export default function StatsCards() {
    const [counts, setCounts] = useState({
        drivers: null,
        companies: null,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCounts() {
            try {
                setLoading(true);

                const [driversResponse, companiesResponse] =
                    await Promise.all([
                        fetch("/api/drivers", {
                            cache: "no-store",
                        }),
                        fetch("/api/companies", {
                            cache: "no-store",
                        }),
                    ]);

                const driversData =
                    await driversResponse.json();

                const companiesData =
                    await companiesResponse.json();

                setCounts({
                    drivers: Array.isArray(
                        driversData.drivers
                    )
                        ? driversData.drivers.length
                        : 0,

                    companies: Array.isArray(
                        companiesData.companies
                    )
                        ? companiesData.companies.length
                        : 0,
                });
            } catch (error) {
                console.error(
                    "Stats cards fetch error:",
                    error
                );

                setCounts({
                    drivers: 0,
                    companies: 0,
                });
            } finally {
                setLoading(false);
            }
        }

        loadCounts();
    }, []);

    return (
        <section className="stats-grid">
            {statsConfig.map((stat) => {
                const Icon = stat.icon;

                const value = loading
                    ? "..."
                    : (
                          counts[stat.key] ?? 0
                      ).toLocaleString("fa-IR");

                return (
                    <Link
                        href={stat.href}
                        className="stat-card stat-card-clickable"
                        key={stat.title}
                    >
                        <div className="stat-card-top">
                            <div
                                className={`stat-icon stat-icon-${stat.type}`}
                            >
                                <Icon size={22} />
                            </div>

                            <div className="stat-arrow">
                                <ArrowUpLeft size={16} />
                            </div>
                        </div>

                        <div className="stat-info">
                            <span>{stat.title}</span>

                            <strong>{value}</strong>

                            <small>
                                {stat.description}
                            </small>
                        </div>
                    </Link>
                );
            })}

            <AnimatedTruck />
        </section>
    );
}
