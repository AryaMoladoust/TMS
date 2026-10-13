import Link from "next/link";

import { ArrowRight } from "lucide-react";

import DriverForm from "@/components/drivers/DriverForm";

export default function AddDriverPage() {
    return (
        <main className="main-content">
            <div className="page-heading page-heading-with-action">
                <div>
                    <div className="driver-back-wrap">
                        <Link
                            href="/drivers"
                            className="driver-back-button"
                        >
                            <span className="driver-back-icon">
                                <ArrowRight size={16} />
                            </span>
                            بازگشت به رانندگان
                        </Link>
                    </div>

                    <h1>افزودن راننده</h1>

                    <p>
                        اطلاعات راننده جدید را وارد کنید
                    </p>
                </div>
            </div>

            <DriverForm />
        </main>
    );
}