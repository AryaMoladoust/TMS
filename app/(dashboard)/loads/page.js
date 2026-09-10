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

export default function LoadsPage() {
    return (
        <main className="main-content">

            {/* Page Header */}

            <div className="page-heading page-heading-with-action">

                <div>
                    <h1>بارها</h1>

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


            {/* Statistics */}

            <section className="load-stats-grid">

                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-blue">
                        <Package size={22} />
                    </div>

                    <div>
                        <span>
                            کل بارها
                        </span>

                        <strong>
                            ۳۶
                        </strong>
                    </div>

                </div>


                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-orange">
                        <Clock3 size={22} />
                    </div>

                    <div>
                        <span>
                            تحویل نشده
                        </span>

                        <strong>
                            ۱۲
                        </strong>
                    </div>

                </div>


                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-green">
                        <CheckCircle2 size={22} />
                    </div>

                    <div>
                        <span>
                            تحویل شده
                        </span>

                        <strong>
                            ۲۴
                        </strong>
                    </div>

                </div>


                <div className="load-stat-card">

                    <div className="load-stat-icon load-stat-purple">
                        <Truck size={22} />
                    </div>

                    <div>
                        <span>
                            بارهای امروز
                        </span>

                        <strong>
                            ۹
                        </strong>
                    </div>

                </div>

            </section>


            {/* Search */}

            <LoadSearch />


            {/* Table */}

            <LoadTable />

        </main>
    );
}