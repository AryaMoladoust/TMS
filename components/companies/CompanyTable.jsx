"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  Phone,
  UserRound,
  Eye,
  Pencil,
} from "lucide-react";

export default function CompanyTable({
  search = "",
}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/companies",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "خطا در دریافت شرکت‌ها"
          );
        }

        setCompanies(data.companies || []);
      } catch (error) {
        console.error(
          "Load companies error:",
          error
        );

        setError(
          error.message ||
            "خطا در دریافت لیست شرکت‌ها"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    if (!searchValue) {
      return companies;
    }

    return companies.filter((company) => {
      const name =
        company.name?.toLowerCase() || "";

      const manager =
        company.managerName?.toLowerCase() || "";

      const phone =
        company.phone?.toLowerCase() || "";

      const landline =
        company.landline?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        manager.includes(searchValue) ||
        phone.includes(searchValue) ||
        landline.includes(searchValue)
      );
    });
  }, [companies, search]);

  return (
    <section className="company-table-panel">

      <div className="company-table-header">

        <div>
          <h2>
            لیست شرکت‌ها
          </h2>

          <p>
            شرکت‌های ثبت شده در سیستم
          </p>
        </div>

        <span className="company-count-badge">
          {toPersianNumber(
            filteredCompanies.length
          )}{" "}
          شرکت
        </span>

      </div>

      <div className="company-table-wrapper">

        <table className="company-table">

          <thead>
            <tr>
              <th>شرکت</th>
              <th>نام مسئول</th>
              <th>شماره تماس</th>
              <th>تعداد بار</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >
                  در حال دریافت اطلاعات شرکت‌ها...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              filteredCompanies.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                    }}
                  >
                    {search.trim()
                      ? "شرکتی با این مشخصات پیدا نشد."
                      : "هنوز هیچ شرکتی ثبت نشده است."}
                  </td>
                </tr>
              )}

            {!loading &&
              !error &&
              filteredCompanies.map((company) => (

                <tr key={company._id}>

                  <td>

                    <div className="company-table-name">

                      <div className="company-table-icon">
                        <Building2 size={20} />
                      </div>

                      <div>

                        <strong>
                          {company.name}
                        </strong>

                        <span>
                          {company._id}
                        </span>

                      </div>

                    </div>

                  </td>

                  <td>

                    <div className="company-manager">

                      <UserRound size={17} />

                      <span>
                        {company.managerName}
                      </span>

                    </div>

                  </td>

                  <td>

                    <div className="company-phone">

                      <Phone size={16} />

                      <span>
                        {company.phone}
                      </span>

                    </div>

                  </td>

                  <td>

                    <strong className="company-load-count">
                      {toPersianNumber(0)} بار
                    </strong>

                  </td>

                  <td>

                    <div className="company-actions">

                      <Link
                        href={`/companies/${company._id}`}
                        className="company-action-button"
                        title="مشاهده"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        href={`/companies/${company._id}`}
                        className="company-action-button"
                        title="ویرایش"
                      >
                        <Pencil size={17} />
                      </Link>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

      {!loading &&
        !error &&
        filteredCompanies.length > 0 && (
          <div className="company-table-footer">

            <span>
              نمایش{" "}
              {toPersianNumber(1)} تا{" "}
              {toPersianNumber(
                filteredCompanies.length
              )}{" "}
              از{" "}
              {toPersianNumber(
                filteredCompanies.length
              )}{" "}
              شرکت
            </span>

          </div>
        )}

    </section>
  );
}

function toPersianNumber(number) {
  return String(number).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}