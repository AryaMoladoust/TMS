"use client";

import Link from "next/link";
import {
  UserRound,
  Phone,
  Truck,
  Eye,
  Pencil,
} from "lucide-react";

const drivers = [
  {
    id: "DRV-1001",
    name: "علی رضایی",
    phone: "0912 123 4567",
    nationalId: "۰۰۱۲۳۴۵۶۷۸",
    vehicle: "کامیون",
    plate: "۱۲۳ الف ۴۵",
    status: "available",
  },
  {
    id: "DRV-1002",
    name: "محمد کریمی",
    phone: "0911 456 7890",
    nationalId: "۰۰۲۳۴۵۶۷۸۹",
    vehicle: "تریلی",
    plate: "۵۶۷ ب ۲۳",
    status: "busy",
  },
  {
    id: "DRV-1003",
    name: "رضا احمدی",
    phone: "0912 789 1234",
    nationalId: "۰۰۳۴۵۶۷۸۹۰",
    vehicle: "کامیون",
    plate: "۸۹۰ ج ۱۱",
    status: "available",
  },
  {
    id: "DRV-1004",
    name: "حسین مرادی",
    phone: "0913 234 5678",
    nationalId: "۰۰۴۵۶۷۸۹۰۱",
    vehicle: "نیسان",
    plate: "۲۴۵ د ۶۷",
    status: "inactive",
  },
  {
    id: "DRV-1005",
    name: "امیر حسینی",
    phone: "0910 345 6789",
    nationalId: "۰۰۵۶۷۸۹۰۱۲",
    vehicle: "تریلی",
    plate: "۷۸۹ الف ۳۴",
    status: "busy",
  },
  {
    id: "DRV-1006",
    name: "مجتبی اکبری",
    phone: "0912 567 8901",
    nationalId: "۰۰۶۷۸۹۰۱۲۳",
    vehicle: "کامیون",
    plate: "۴۵۶ ب ۸۹",
    status: "available",
  },
];

const statusData = {
  available: {
    label: "آماده",
    className: "driver-status-available",
  },
  busy: {
    label: "مشغول",
    className: "driver-status-busy",
  },
  inactive: {
    label: "غیرفعال",
    className: "driver-status-inactive",
  },
};

export default function DriverTable() {
  return (
    <section className="driver-table-panel">

      <div className="driver-table-header">
        <div>
          <h2>لیست رانندگان</h2>
          <p>۱۲۸ راننده ثبت شده در سیستم</p>
        </div>

        <span className="driver-count-badge">
          ۱۲۸ راننده
        </span>
      </div>

      <div className="driver-table-wrapper">

        <table className="driver-table">

          <thead>
            <tr>
              <th>راننده</th>
              <th>شماره موبایل</th>
              <th>کد ملی</th>
              <th>خودرو</th>
              <th>پلاک</th>
              <th>وضعیت</th>
              <th>عملیات</th>
            </tr>
          </thead>

          <tbody>

            {drivers.map((driver) => {

              const status = statusData[driver.status];

              return (
                <tr key={driver.id}>

                  <td>
                    <div className="driver-table-name">

                      <div className="driver-table-avatar">
                        <UserRound size={20} />
                      </div>

                      <div>
                        <strong>{driver.name}</strong>
                        <span>{driver.id}</span>
                      </div>

                    </div>
                  </td>

                  <td>
                    <div className="driver-table-phone">
                      <Phone size={16} />
                      {driver.phone}
                    </div>
                  </td>

                  <td>
                    <span className="driver-national-id">
                      {driver.nationalId}
                    </span>
                  </td>

                  <td>
                    <div className="driver-vehicle">
                      <Truck size={17} />
                      {driver.vehicle}
                    </div>
                  </td>

                  <td>
                    <strong className="driver-plate">
                      {driver.plate}
                    </strong>
                  </td>

                  <td>
                    <span className={`driver-status ${status.className}`}>
                      <span className="driver-status-dot" />
                      {status.label}
                    </span>
                  </td>

                  <td>
                    <div className="driver-actions">

                      <Link
                        href={`/drivers/${driver.id}`}
                        className="driver-action-button"
                        title="مشاهده"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        href={`/drivers/${driver.id}`}
                        className="driver-action-button"
                        title="ویرایش"
                      >
                        <Pencil size={17} />
                      </Link>

                    </div>
                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

      <div className="driver-table-footer">
        <span>نمایش ۱ تا ۶ از ۱۲۸ راننده</span>

        <div className="pagination">
          <button disabled>قبلی</button>
          <button className="pagination-active">۱</button>
          <button>۲</button>
          <button>۳</button>
          <span>...</span>
          <button>۲۲</button>
          <button>بعدی</button>
        </div>
      </div>

    </section>
  );
}