"use client";

import Link from "next/link";

import {
  Building2,
  Phone,
  UserRound,
  Eye,
  Pencil,
} from "lucide-react";


const companies = [
  {
    id: "COM-1001",
    name: "شرکت حمل‌ونقل شمال",
    manager: "رضا محمدی",
    phone: "013 3333 4567",
    loads: "۱۲ بار",
  },
  {
    id: "COM-1002",
    name: "صنایع شمال",
    manager: "محمد کریمی",
    phone: "013 3334 7890",
    loads: "۸ بار",
  },
  {
    id: "COM-1003",
    name: "بازرگانی گیلان",
    manager: "علی رضایی",
    phone: "013 3335 1234",
    loads: "۶ بار",
  },
  {
    id: "COM-1004",
    name: "شرکت ساختمانی شمال",
    manager: "حسین مرادی",
    phone: "013 3336 5678",
    loads: "۵ بار",
  },
  {
    id: "COM-1005",
    name: "پخش گیلان",
    manager: "امیر حسینی",
    phone: "013 3337 8901",
    loads: "۴ بار",
  },
  {
    id: "COM-1006",
    name: "تجارت البرز",
    manager: "مجتبی اکبری",
    phone: "013 3338 2345",
    loads: "۳ بار",
  },
];


export default function CompanyTable() {
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
          {toPersianNumber(companies.length)} شرکت
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

            {companies.map((company) => (

              <tr key={company.id}>

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
                        {company.id}
                      </span>

                    </div>

                  </div>

                </td>


                <td>

                  <div className="company-manager">

                    <UserRound size={17} />

                    <span>
                      {company.manager}
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
                    {company.loads}
                  </strong>

                </td>


                <td>

                  <div className="company-actions">

                    <Link
                      href={`/companies/${company.id}`}
                      className="company-action-button"
                      title="مشاهده"
                    >
                      <Eye size={17} />
                    </Link>


                    <Link
                      href={`/companies/${company.id}`}
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


      <div className="company-table-footer">

        <span>
          نمایش {toPersianNumber(1)} تا{" "}
          {toPersianNumber(companies.length)} از{" "}
          {toPersianNumber(companies.length)} شرکت
        </span>

      </div>

    </section>
  );
}


function toPersianNumber(number) {
  return String(number).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}