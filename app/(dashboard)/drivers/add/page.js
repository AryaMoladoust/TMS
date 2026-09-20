import Link from "next/link";

import { ArrowRight } from "lucide-react";

import DriverForm from "@/components/drivers/DriverForm";

export default function AddDriverPage() {
    return (
        <main className="main-content">
            <div className="page-heading page-heading-with-action">
                <div>
                    <div className="page-back-link">
                        <Link href="/drivers">
                            <ArrowRight size={17} />
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