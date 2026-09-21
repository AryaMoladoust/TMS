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


const statusData = {

  pending: {
    label: "تحویل نشده",
    className: "load-status-undelivered",
  },

  assigned: {
    label: "در حال ارسال",
    className: "load-status-undelivered",
  },

  delivered: {
    label: "تحویل شده",
    className: "load-status-delivered",
  },

};


// =====================================
// تبدیل نوع بار به فارسی
// =====================================

const barTypeData = {

  food: "مواد غذایی",

  industrial: "قطعات صنعتی",

  construction: "مصالح ساختمانی",

  agriculture: "محصولات کشاورزی",

  other: "سایر",

};


// =====================================
// تبدیل نوع خودرو به فارسی
// =====================================

const vehicleData = {

  truck: "کامیون",

  trailer: "تریلی",

  pickup: "نیسان",

  van: "وانت",

};


// =====================================
// تبدیل تاریخ به فارسی
// =====================================

function formatDate(date) {

  if (!date) {
    return "—";
  }


  const loadDate =
    new Date(date);


  if (isNaN(loadDate.getTime())) {
    return "—";
  }


  const today =
    new Date();


  const yesterday =
    new Date();


  yesterday.setDate(
    yesterday.getDate() - 1
  );


  // امروز

  if (
    loadDate.getFullYear() ===
    today.getFullYear() &&

    loadDate.getMonth() ===
    today.getMonth() &&

    loadDate.getDate() ===
    today.getDate()
  ) {

    return "امروز";
  }


  // دیروز

  if (
    loadDate.getFullYear() ===
    yesterday.getFullYear() &&

    loadDate.getMonth() ===
    yesterday.getMonth() &&

    loadDate.getDate() ===
    yesterday.getDate()
  ) {

    return "دیروز";
  }


  // تاریخ فارسی

  return loadDate.toLocaleDateString(
    "fa-IR",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );
}


// =====================================
// LoadTable
// =====================================

export default function LoadTable({
  loads = [],
}) {


  // =================================
  // مرتب‌سازی
  // بارهای تحویل نشده ابتدا
  // =================================

  const sortedLoads = [
    ...loads,
  ].sort((a, b) => {

    if (
      a.status !== "delivered" &&
      b.status === "delivered"
    ) {
      return -1;
    }


    if (
      a.status === "delivered" &&
      b.status !== "delivered"
    ) {
      return 1;
    }


    return (
      new Date(b.createdAt || 0) -
      new Date(a.createdAt || 0)
    );

  });


  return (

    <section className="load-table-panel">


      {/* =================================
          Header
      ================================== */}

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

          {loads.length.toLocaleString("fa-IR")}

          {" بار"}

        </span>

      </div>



      {/* =================================
          Table
      ================================== */}

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


            {sortedLoads.length === 0 ? (

              <tr>

                <td
                  colSpan={8}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >

                    <Package
                      size={35}
                    />

                    <strong>
                      هنوز هیچ باری ثبت نشده است
                    </strong>

                    <span>
                      برای شروع، یک بار جدید ثبت کنید.
                    </span>

                  </div>

                </td>

              </tr>

            ) : (

              sortedLoads.map(
                (load) => {

                  const status =
                    statusData[
                    load.status
                    ] ||
                    statusData.pending;


                  return (

                    <tr
                      key={load._id}
                    >


                      {/* =========================
                          Load
                      ========================== */}

                      <td>

                        <div className="load-table-name">

                          <div className="load-table-icon">

                            <Package
                              size={20}
                            />

                          </div>


                          <div>

                            <strong>
                              {load.title}
                            </strong>


                            <span>
                              {
                                barTypeData[
                                load.barType
                                ] ||
                                load.barType ||
                                "—"
                              }
                            </span>

                          </div>

                        </div>

                      </td>



                      {/* =========================
                          Company
                      ========================== */}

                      <td>

                        <div className="load-company">

                          <Building2
                            size={16}
                          />


                          <span>

                            {
                              load.companyName ||
                              "—"
                            }

                          </span>

                        </div>

                      </td>



                      {/* =========================
                          Route
                      ========================== */}

                      <td>

                        <div className="load-route">


                          <div>

                            <MapPin
                              size={14}
                            />

                            <span>
                              {load.origin}
                            </span>

                          </div>


                          <ArrowLeft
                            size={15}
                          />


                          <div>

                            <MapPin
                              size={14}
                            />

                            <span>
                              {load.destination}
                            </span>

                          </div>

                        </div>

                      </td>



                      {/* =========================
                          Driver
                      ========================== */}

                      <td>

                        <strong className="load-driver-name">

                          {load.driver ||
                            "—"}

                        </strong>

                      </td>



                      {/* =========================
                          Vehicle
                      ========================== */}

                      <td>

                        <div className="load-vehicle">

                          <Truck
                            size={16}
                          />


                          {
                            vehicleData[
                            load.vehicleType
                            ] ||
                            load.vehicleType ||
                            "—"
                          }

                        </div>

                      </td>



                      {/* =========================
                          Date
                      ========================== */}

                      <td>

                        <span className="load-date">

                          {formatDate(
                            load.createdAt
                          )}

                        </span>

                      </td>



                      {/* =========================
                          Status
                      ========================== */}

                      <td>

                        <span
                          className={`load-status-badge ${status.className}`}
                        >

                          <span className="load-status-dot" />


                          {status.label}

                        </span>

                      </td>



                      {/* =========================
                          Actions
                      ========================== */}

                      <td>

                        <div className="load-actions">


                          <Link
                            href={`/loads/${load._id}`}
                            className="load-action-button"
                            title="مشاهده"
                          >

                            <Eye
                              size={17}
                            />

                          </Link>


                          <Link
                            href={`/loads/${load._id}/edit`}
                            className="load-action-button"
                            title="ویرایش"
                          >

                            <Pencil
                              size={17}
                            />

                          </Link>


                        </div>

                      </td>


                    </tr>

                  );

                }
              )

            )}

          </tbody>

        </table>

      </div>



      {/* =================================
          Footer
      ================================== */}

      <div className="load-table-footer">

        <span>

          نمایش{" "}

          {sortedLoads.length === 0
            ? "۰"
            : `۱ تا ${sortedLoads.length.toLocaleString("fa-IR")}`
          }

          {" از "}

          {loads.length.toLocaleString("fa-IR")}

          {" بار"}

        </span>


        <div className="pagination">

          <button disabled>
            قبلی
          </button>


          <button className="pagination-active">
            ۱
          </button>


          <button disabled>
            بعدی
          </button>

        </div>

      </div>


    </section>

  );

}