import Link from "next/link";

import {
  Plus,
  Building2,
  Phone,
  UserRound,
  Eye,
  Pencil,
} from "lucide-react";

import CompanySearch from "@/components/companies/CompanySearch";
import CompanyTable from "@/components/companies/CompanyTable";

export default function CompaniesPage() {
  return (
    <main className="main-content">

      {/* Page Header */}

      <div className="page-heading page-heading-with-action">

        <div>
          <h1>شرکت‌ها</h1>

          <p>
            مشاهده و مدیریت شرکت‌های ثبت شده
          </p>
        </div>

        <Link
          href="/companies/add"
          className="primary-action-button"
        >
          <Plus size={19} />

          <span>
            افزودن شرکت
          </span>
        </Link>

      </div>


      {/* Search */}

      <CompanySearch />


      {/* Companies List */}

      <CompanyTable />

    </main>
  );
}