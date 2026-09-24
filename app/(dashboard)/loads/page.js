import Link from "next/link";

import {
    Plus,
    Package,
} from "lucide-react";

import LoadsBoard from "@/components/loads/LoadsBoard";


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

            </section>


            {/* =====================================
                Search + Table
            ====================================== */}

            <LoadsBoard
                loads={loads}
            />

        </main>
    );
}
