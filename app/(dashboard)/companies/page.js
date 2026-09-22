"use client";

import Link from "next/link";
import { useState } from "react";

import {
  Plus,
} from "lucide-react";

import CompanySearch from "@/components/companies/CompanySearch";
import CompanyTable from "@/components/companies/CompanyTable";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");

  return (
    <main className="main-content">

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

      <CompanySearch
        search={search}
        setSearch={setSearch}
      />

      <CompanyTable
        search={search}
      />

    </main>
  );
}