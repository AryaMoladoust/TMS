import Link from "next/link";

import {
    Plus,
    Package,
    Truck,
    Clock3,
    CheckCircle2,
} from "lucide-react";

import LoadSearch from "@/components/loads/LoadSearch";
import LoadTable from "@/components/loads/LoadTable";


// =====================================
// دریافت بارها از API
// =====================================

async function getLoads() {

    try {

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/loads`,
            {
                cache: "no-store",
            }
        );


        if (!response.ok) {
            throw new Error(
                "خطا در دریافت بارها"
            );
        }


        return await response.json();

    } catch (error) {

        console.error(
            "getLoads error:",
            error
        );

        return [];
    }
}


// =====================================
// صفحه بارها
// =====================================

export default async function LoadsPage() {

    const loads = await getLoads();


    // =================================
    // آمار
    // =================================

    const totalLoads =
        loads.length;


    const deliveredLoads =
        loads.filter(
            (load) =>
                load.status === "delivered"
        ).length;


    const pendingLoads =
        loads.filter(
            (load) =>
                load.status !== "delivered"
        ).length;


    // =================================
    // بارهای امروز
    // =================================

    const today =
        new Date();


    const todayYear =
        today.getFullYear();


    const todayMonth =
        today.getMonth();


    const todayDay =
        today.getDate();


    const todayLoads =
        loads.filter((load) => {

            if (!load.createdAt) {
                return false;
            }


            const loadDate =
                new Date(load.createdAt);


            return (
                loadDate.getFullYear() ===
                todayYear &&

                loadDate.getMonth() ===
                todayMonth &&

                loadDate.getDate() ===
                todayDay
            );

        }).length;


    return (
        <main className="main-content">

            {/* =====================================
                Page Header
            ====================================== */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <h1>
                        بارها
                    </h1>


                    <p>
                        مدیریت و مشاهده وضعیت بارهای ثبت شده
                    </p>

                </div>


                <Link
                    href="/loads/add"
                    className="primary-action-button"
                >

                    <Plus size={19} />

                    <span>
                        افزودن بار
                    </span>

                </Link>

            </div>


            {/* =====================================
                Statistics
            ====================================== */}

            <section className="load-stats-grid">


                {/* کل بارها */}

                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-blue">

                        <Package size={22} />

                    </div>


                    <div>

                        <span>
                            کل بارها
                        </span>


                        <strong>
                            {totalLoads}
                        </strong>

                    </div>

                </div>



                {/* تحویل نشده */}

                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-orange">

                        <Clock3 size={22} />

                    </div>


                    <div>

                        <span>
                            تحویل نشده
                        </span>


                        <strong>
                            {pendingLoads}
                        </strong>

                    </div>

                </div>



                {/* تحویل شده */}

                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-green">

                        <CheckCircle2 size={22} />

                    </div>


                    <div>

                        <span>
                            تحویل شده
                        </span>


                        <strong>
                            {deliveredLoads}
                        </strong>

                    </div>

                </div>



                {/* بارهای امروز */}

                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-purple">

                        <Truck size={22} />

                    </div>


                    <div>

                        <span>
                            بارهای امروز
                        </span>


                        <strong>
                            {todayLoads}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =====================================
                Search
            ====================================== */}

            <LoadSearch />


            {/* =====================================
                Table
            ====================================== */}

            <LoadTable
                loads={loads}
            />

        </main>
    );
}

