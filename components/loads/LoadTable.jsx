"use client";

import Link from "next/link";

import {
  Package,
  MapPin,
  ArrowLeft,
  Truck,
  Building2,
  Eye,
  Pencil,
} from "lucide-react";


const loads = [

  {
    id: "B-1028",
    date: "امروز",
    type: "مواد غذایی",
    company: "شرکت حمل‌ونقل شمال",
    origin: "رشت",
    destination: "تهران",
    vehicle: "کامیون",
    driver: "علی رضایی",
    status: "undelivered",
  },

  {
    id: "B-1027",
    date: "امروز",
    type: "قطعات صنعتی",
    company: "صنایع شمال",
    origin: "قزوین",
    destination: "تبریز",
    vehicle: "تریلی",
    driver: "محمد کریمی",
    status: "undelivered",
  },

  {
    id: "B-1026",
    date: "امروز",
    type: "محصولات کشاورزی",
    company: "بازرگانی گیلان",
    origin: "لاهیجان",
    destination: "تهران",
    vehicle: "کامیون",
    driver: "رضا احمدی",
    status: "undelivered",
  },

  {
    id: "B-1025",
    date: "دیروز",
    type: "مصالح ساختمانی",
    company: "شرکت ساختمانی شمال",
    origin: "رشت",
    destination: "کرج",
    vehicle: "تریلی",
    driver: "امیر حسینی",
    status: "delivered",
  },

  {
    id: "B-1024",
    date: "دیروز",
    type: "مواد غذایی",
    company: "پخش گیلان",
    origin: "رشت",
    destination: "مشهد",
    vehicle: "کامیون",
    driver: "حسین مرادی",
    status: "delivered",
  },

  {
    id: "B-1023",
    date: "۲ روز پیش",
    type: "قطعات صنعتی",
    company: "صنایع شمال",
    origin: "قزوین",
    destination: "رشت",
    vehicle: "تریلی",
    driver: "مجتبی اکبری",
    status: "delivered",
  },

];


const statusData = {

  undelivered: {
    label: "تحویل نشده",
    className: "load-status-undelivered",
  },

  delivered: {
    label: "تحویل شده",
    className: "load-status-delivered",
  },

};


export default function LoadTable() {

  return (
    <section className="load-table-panel">

      <div className="load-table-header">

        <div>

          <h2>
            لیست بارها
          </h2>

          <p>
            بارهای تحویل نشده در ابتدا نمایش داده می‌شوند
          </p>

        </div>

        <span className="load-count-badge">
          ۳۶ بار
        </span>

      </div>


      <div className="load-table-wrapper">

        <table className="load-table">

          <thead>

            <tr>

              <th>
                بار
              </th>

              <th>
                شرکت
              </th>

              <th>
                مسیر
              </th>

              <th>
                راننده
              </th>

              <th>
                خودرو
              </th>

              <th>
                تاریخ
              </th>

              <th>
                وضعیت
              </th>

              <th>
                عملیات
              </th>

            </tr>

          </thead>


          <tbody>

            {loads.map((load) => {

              const status =
                statusData[load.status];

              return (
                <tr key={load.id}>

                  {/* Load */}

                  <td>

                    <div className="load-table-name">

                      <div className="load-table-icon">
                        <Package size={20} />
                      </div>

                      <div>

                        <strong>
                          {load.id}
                        </strong>

                        <span>
                          {load.type}
                        </span>

                      </div>

                    </div>

                  </td>


                  {/* Company */}

                  <td>

                    <div className="load-company">

                      <Building2 size={16} />

                      <span>
                        {load.company}
                      </span>

                    </div>

                  </td>


                  {/* Route */}

                  <td>

                    <div className="load-route">

                      <div>
                        <MapPin size={14} />
                        <span>
                          {load.origin}
                        </span>
                      </div>

                      <ArrowLeft size={15} />

                      <div>
                        <MapPin size={14} />
                        <span>
                          {load.destination}
                        </span>
                      </div>

                    </div>

                  </td>


                  {/* Driver */}

                  <td>

                    <strong className="load-driver-name">
                      {load.driver}
                    </strong>

                  </td>


                  {/* Vehicle */}

                  <td>

                    <div className="load-vehicle">

                      <Truck size={16} />

                      {load.vehicle}

                    </div>

                  </td>


                  {/* Date */}

                  <td>

                    <span className="load-date">
                      {load.date}
                    </span>

                  </td>


                  {/* Status */}

                  <td>

                    <span
                      className={`load-status-badge ${status.className}`}
                    >

                      <span className="load-status-dot" />

                      {status.label}

                    </span>

                  </td>


                  {/* Actions */}

                  <td>

                    <div className="load-actions">

                      <Link
                        href={`/loads/${load.id}`}
                        className="load-action-button"
                        title="مشاهده"
                      >
                        <Eye size={17} />
                      </Link>

                      <Link
                        href={`/loads/${load.id}`}
                        className="load-action-button"
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


      {/* Footer */}

      <div className="load-table-footer">

        <span>
          نمایش ۱ تا ۶ از ۳۶ بار
        </span>


        <div className="pagination">

          <button disabled>
            قبلی
          </button>

          <button className="pagination-active">
            ۱
          </button>

          <button>
            ۲
          </button>

          <button>
            ۳
          </button>

          <span>
            ...
          </span>

          <button>
            ۶
          </button>

          <button>
            بعدی
          </button>

        </div>

      </div>

    </section>
  );
}