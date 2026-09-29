import Link from "next/link";
import DeleteLoadButton from "@/components/loads/DeleteLoadButton";
import {
  ArrowRight,
  Package,
  Building2,
  MapPin,
  Route,
  Truck,
  FileText,
  Pencil,
} from "lucide-react";

/* =========================================================
   تبدیل نوع بار به فارسی
========================================================= */

const barTypeLabels = {
  food: "مواد غذایی",
  industrial: "قطعات صنعتی",
  construction: "مصالح ساختمانی",
  agriculture: "محصولات کشاورزی",
  other: "سایر",
};

function getBarTypeLabel(value) {
  return barTypeLabels[value] || value || "—";
}

/* =========================================================
   تبدیل نوع خودرو به فارسی
========================================================= */

const vehicleTypeLabels = {
  truck: "کامیون",
  trailer: "تریلی",
  pickup: "نیسان",
  van: "وانت",
};

function getVehicleTypeLabel(value) {
  return vehicleTypeLabels[value] || value || "—";
}

async function getLoad(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/loads/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("بار پیدا نشد");
  }

  return res.json();
}

export default async function LoadDetailsPage({ params }) {
  const { id } = await params;
  const load = await getLoad(id);

  return (
    <main className="main-content">
      {/* Header */}
      <div className="page-heading page-heading-with-action">
        <div>
          <div className="page-back-link">
            <Link href="/loads">
              <ArrowRight size={17} />
              بازگشت به بارها
            </Link>
          </div>

          <h1>{load.title}</h1>
          <p>مشاهده اطلاعات کامل بار</p>
        </div>

        <div className="page-heading-actions">
          <Link
            href={`/loads/${load._id}/edit`}
            className="primary-action-button"
          >
            <Pencil size={18} />
            ویرایش
          </Link>

          <DeleteLoadButton loadId={load._id} />
        </div>
      </div>

      {/* Card */}
      <section className="details-card">
        <div className="details-grid">

          <div className="details-item">
            <Package size={20} />
            <div>
              <span>نوع بار</span>
              <strong>{getBarTypeLabel(load.barType)}</strong>
            </div>
          </div>

          <div className="details-item">
            <Building2 size={20} />
            <div>
              <span>شرکت</span>
              <strong>{load.companyName || "—"}</strong>
            </div>
          </div>

          <div className="details-item">
            <MapPin size={20} />
            <div>
              <span>مبدأ</span>
              <strong>{load.origin}</strong>
            </div>
          </div>

          <div className="details-item">
            <MapPin size={20} />
            <div>
              <span>مقصد</span>
              <strong>{load.destination}</strong>
            </div>
          </div>

          <div className="details-item">
            <Route size={20} />
            <div>
              <span>مسافت</span>
              <strong>{load.distance} کیلومتر</strong>
            </div>
          </div>

          <div className="details-item">
            <Truck size={20} />
            <div>
              <span>نوع خودرو</span>
              <strong>{getVehicleTypeLabel(load.vehicleType)}</strong>
            </div>
          </div>

        </div>

        <div className="details-description">
          <div className="details-title">
            <FileText size={18} />
            <span>توضیحات</span>
          </div>

          <p>{load.description || "توضیحی ثبت نشده است."}</p>
        </div>
      </section>
    </main>
  );
}
