"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Package,
  Building2,
  MapPin,
  Route,
  Truck,
  FileText,
  Save,
  Navigation,
  Tag,
  Map,
} from "lucide-react";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => <div className="map-loading">در حال بارگذاری نقشه...</div>,
});

// باید دقیقاً هماهنگ با گزینه‌های فرم افزودن بار باشد
const COMPANIES = [
  { code: "COM-1001", name: "شرکت حمل‌ونقل شمال" },
  { code: "COM-1002", name: "صنایع شمال" },
  { code: "COM-1003", name: "بازرگانی گیلان" },
  { code: "COM-1004", name: "شرکت ساختمانی شمال" },
];

export default function EditLoadForm({ load }) {
  const router = useRouter();

  // چون فقط اسم شرکت (companyName) ذخیره شده، کد متناظرش رو پیدا می‌کنیم
  const initialCompanyCode =
    COMPANIES.find((c) => c.name === load.companyName)?.code || "";

  const [showDestinationMap, setShowDestinationMap] = useState(false);

  const [destinationLocation, setDestinationLocation] = useState(
    load.destinationLat && load.destinationLng
      ? { lat: load.destinationLat, lng: load.destinationLng }
      : null
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const companySelect = form.elements.loadCompany;
    const companyName =
      companySelect.options[companySelect.selectedIndex]?.text || "";

    const loadData = {
      title: formData.get("loadTitle"),
      companyName,
      barType: formData.get("loadType"),
      origin: formData.get("loadOrigin"),
      destination: formData.get("loadDestination"),
      destinationLat: destinationLocation?.lat ?? load.destinationLat ?? null,
      destinationLng: destinationLocation?.lng ?? load.destinationLng ?? null,
      address: formData.get("loadAddress"),
      distance: Number(formData.get("loadDistance")),
      provinceStatus: formData.get("loadProvinceStatus"),
      vehicleType: formData.get("loadVehicleType"),
      description: formData.get("loadDescription"),
    };

    try {
      const response = await fetch(`/api/loads/${load._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loadData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || result.error || "خطا در ویرایش بار");
        return;
      }

      alert("بار با موفقیت ویرایش شد.");

      router.push(`/loads/${load._id}`);
      router.refresh();
    } catch (error) {
      console.error("Submit error:", error);
      alert("ویرایش بار انجام نشد.");
    }
  };

  return (
    <main className="main-content">
      {/* Header */}
      <div className="page-heading page-heading-with-action">
        <div>
          <div className="page-back-link">
            <Link href={`/loads/${load._id}`}>
              <ArrowRight size={17} />
              بازگشت به جزئیات بار
            </Link>
          </div>

          <h1>ویرایش بار</h1>
          <p>اطلاعات بار را ویرایش کنید</p>
        </div>
      </div>

      <section className="load-form-panel">
        <div className="load-form-header">
          <div className="load-form-header-icon">
            <Package size={24} />
          </div>
          <div>
            <h2>اطلاعات بار</h2>
            <p>اطلاعات شرکت، نوع بار، مسیر و مشخصات حمل را ویرایش کنید</p>
          </div>
        </div>

        <form className="load-form" onSubmit={handleSubmit}>
          {/* عنوان بار */}
          <div className="load-form-group load-form-full">
            <label htmlFor="loadTitle">
              عنوان بار <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Tag size={18} />
              <input
                id="loadTitle"
                name="loadTitle"
                type="text"
                defaultValue={load.title || ""}
              />
            </div>
          </div>

          {/* شرکت */}
          <div className="load-form-group">
            <label htmlFor="loadCompany">
              شرکت <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Building2 size={18} />
              <select
                id="loadCompany"
                name="loadCompany"
                defaultValue={initialCompanyCode}
              >
                <option value="" disabled>
                  شرکت را انتخاب کنید
                </option>
                {COMPANIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* نوع بار */}
          <div className="load-form-group">
            <label htmlFor="loadType">
              نوع بار <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Package size={18} />
              <select
                id="loadType"
                name="loadType"
                defaultValue={load.barType || ""}
              >
                <option value="" disabled>
                  نوع بار را انتخاب کنید
                </option>
                <option value="food">مواد غذایی</option>
                <option value="industrial">قطعات صنعتی</option>
                <option value="construction">مصالح ساختمانی</option>
                <option value="agriculture">محصولات کشاورزی</option>
                <option value="other">سایر</option>
              </select>
            </div>
          </div>

          <div className="load-form-section-title load-form-full">
            <MapPin size={19} />
            <span>مسیر بار</span>
          </div>

          {/* مبدأ */}
          <div className="load-form-group">
            <label htmlFor="loadOrigin">
              مبدأ <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <MapPin size={18} />
              <input
                id="loadOrigin"
                name="loadOrigin"
                type="text"
                defaultValue={load.origin || ""}
              />
            </div>
          </div>

          {/* مقصد */}
          <div className="load-form-group">
            <label htmlFor="loadDestination">
              مقصد <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Navigation size={18} />
              <input
                id="loadDestination"
                name="loadDestination"
                type="text"
                defaultValue={load.destination || ""}
              />
            </div>

            <button
              type="button"
              className="map-select-button"
              onClick={() => setShowDestinationMap(true)}
            >
              <Map size={17} />
              {destinationLocation
                ? "تغییر محل مقصد روی نقشه"
                : "انتخاب مقصد روی نقشه"}
            </button>

            {destinationLocation && (
              <div className="destination-selected">
                <MapPin size={17} />
                <div>
                  <strong>مقصد روی نقشه انتخاب شد</strong>
                  <span>
                    {destinationLocation.lat.toFixed(6)}
                    {" , "}
                    {destinationLocation.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {showDestinationMap && (
            <div className="load-map-section load-form-full">
              <div className="map-section-header">
                <div>
                  <MapPin size={19} />
                  <strong>انتخاب محل دقیق مقصد</strong>
                </div>
                <span>روی محل دقیق مقصد کلیک کنید</span>
              </div>

              <MapPicker
                initialPosition={
                  destinationLocation || {
                    lat: 35.6892,
                    lng: 51.389,
                  }
                }
                onConfirm={(location) => {
                  setDestinationLocation(location);
                  setShowDestinationMap(false);
                }}
              />
            </div>
          )}

          {/* آدرس بار */}
          <div className="load-form-group load-form-full">
            <label htmlFor="loadAddress">
              آدرس بار <span>*</span>
            </label>
            <div className="load-input-wrapper load-textarea-wrapper">
              <MapPin size={18} />
              <textarea
                id="loadAddress"
                name="loadAddress"
                rows={3}
                defaultValue={load.address || ""}
              />
            </div>
          </div>

          {/* مسافت */}
          <div className="load-form-group">
            <label htmlFor="loadDistance">
              مسافت <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Route size={18} />
              <input
                id="loadDistance"
                name="loadDistance"
                type="number"
                min="0"
                defaultValue={load.distance ?? ""}
              />
              <span className="load-input-unit">کیلومتر</span>
            </div>
          </div>

          {/* وضعیت مسیر */}
          <div className="load-form-group">
            <label htmlFor="loadProvinceStatus">
              وضعیت مسیر <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <MapPin size={18} />
              <select
                id="loadProvinceStatus"
                name="loadProvinceStatus"
                defaultValue={load.provinceStatus || ""}
              >
                <option value="" disabled>
                  وضعیت مسیر را انتخاب کنید
                </option>
                <option value="inside">داخل استان</option>
                <option value="outside">خارج استان</option>
              </select>
            </div>
          </div>

          <div className="load-form-section-title load-form-full">
            <Truck size={19} />
            <span>نوع خودرو</span>
          </div>

          <div className="load-form-group">
            <label htmlFor="loadVehicleType">
              نوع خودرو <span>*</span>
            </label>
            <div className="load-input-wrapper">
              <Truck size={18} />
              <select
                id="loadVehicleType"
                name="loadVehicleType"
                defaultValue={load.vehicleType || ""}
              >
                <option value="" disabled>
                  نوع خودرو را انتخاب کنید
                </option>
                <option value="truck">کامیون</option>
                <option value="trailer">تریلی</option>
                <option value="pickup">نیسان</option>
                <option value="van">وانت</option>
              </select>
            </div>
          </div>

          <div className="load-form-section-title load-form-full">
            <FileText size={19} />
            <span>توضیحات</span>
          </div>

          <div className="load-form-group load-form-full">
            <label htmlFor="loadDescription">توضیحات بار</label>
            <div className="load-input-wrapper load-textarea-wrapper">
              <FileText size={18} />
              <textarea
                id="loadDescription"
                name="loadDescription"
                rows={4}
                defaultValue={load.description || ""}
              />
            </div>
          </div>

          <div className="load-form-actions">
            <Link href={`/loads/${load._id}`} className="load-cancel-button">
              انصراف
            </Link>

            <button type="submit" className="primary-action-button">
              <Save size={19} />
              <span>ذخیره تغییرات</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}