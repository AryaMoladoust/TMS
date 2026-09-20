"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PersianDatePicker from "@/components/drivers/PersianDatePicker";

import {
  UserRound,
  Phone,
  MapPin,
  Truck,
  CreditCard,
  CalendarDays,
  Save,
} from "lucide-react";

export default function DriverForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    phone: "",
    landline: "",
    address: "",
    vehicleType: "",
    vehiclePlate: "",
    licenseNumber: "",
  });

  const [licenseExpiry, setLicenseExpiry] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.nationalId ||
      !formData.phone ||
      !formData.vehicleType ||
      !formData.vehiclePlate ||
      !formData.licenseNumber
    ) {
      setError("لطفاً تمام فیلدهای الزامی را تکمیل کنید.");
      return;
    }

    if (!/^\d{10}$/.test(formData.nationalId)) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          licenseExpiry: licenseExpiry
            ? licenseExpiry.format("YYYY/MM/DD")
            : "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "خطا در ثبت راننده"
        );
      }

      router.push("/drivers");
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="driver-form-panel">
      <div className="driver-form-header">
        <div className="driver-form-header-icon">
          <UserRound size={24} />
        </div>

        <div>
          <h2>اطلاعات راننده</h2>
          <p>
            اطلاعات شخصی، خودرو و گواهینامه راننده را وارد کنید
          </p>
        </div>
      </div>

      <form
        className="driver-form"
        onSubmit={handleSubmit}
      >
        {/* اطلاعات شخصی */}

        <div className="driver-form-section-title">
          <UserRound size={19} />
          <span>اطلاعات شخصی</span>
        </div>

        <div className="driver-form-group">
          <label htmlFor="name">
            نام و نام خانوادگی <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <UserRound size={18} />

            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="مثلاً علی رضایی"
            />
          </div>
        </div>

        <div className="driver-form-group">
          <label htmlFor="nationalId">
            کد ملی <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <CreditCard size={18} />

            <input
              id="nationalId"
              type="text"
              inputMode="numeric"
              value={formData.nationalId}
              onChange={handleChange}
              placeholder="مثلاً ۱۲۳۴۵۶۷۸۹۰"
              maxLength={10}
            />
          </div>
        </div>

        <div className="driver-form-group">
          <label htmlFor="phone">
            شماره موبایل <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <Phone size={18} />

            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"
            />
          </div>
        </div>

        <div className="driver-form-group">
          <label htmlFor="landline">
            تلفن ثابت
          </label>

          <div className="driver-input-wrapper">
            <Phone size={18} />

            <input
              id="landline"
              type="tel"
              value={formData.landline}
              onChange={handleChange}
              placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
            />
          </div>
        </div>

        <div className="driver-form-group driver-form-full">
          <label htmlFor="address">
            آدرس
          </label>

          <div className="driver-input-wrapper driver-textarea-wrapper">
            <MapPin size={18} />

            <textarea
              id="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="آدرس محل سکونت راننده را وارد کنید..."
              rows={4}
            />
          </div>
        </div>

        {/* اطلاعات خودرو */}

        <div className="driver-form-section-title driver-form-full">
          <Truck size={19} />
          <span>اطلاعات خودرو</span>
        </div>

        <div className="driver-form-group">
          <label htmlFor="vehicleType">
            نوع خودرو <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <Truck size={18} />

            <select
              id="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
            >
              <option value="" disabled>
                نوع خودرو را انتخاب کنید
              </option>

              <option value="truck">
                کامیون
              </option>

              <option value="trailer">
                تریلی
              </option>

              <option value="pickup">
                نیسان
              </option>

              <option value="van">
                وانت
              </option>
            </select>
          </div>
        </div>

        <div className="driver-form-group">
          <label htmlFor="vehiclePlate">
            شماره پلاک <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <Truck size={18} />

            <input
              id="vehiclePlate"
              type="text"
              value={formData.vehiclePlate}
              onChange={handleChange}
              placeholder="مثلاً ۱۲۳ الف ۴۵"
            />
          </div>
        </div>

        {/* اطلاعات گواهینامه */}

        <div className="driver-form-section-title driver-form-full">
          <CreditCard size={19} />
          <span>اطلاعات گواهینامه</span>
        </div>

        <div className="driver-form-group">
          <label htmlFor="licenseNumber">
            شماره گواهینامه <span>*</span>
          </label>

          <div className="driver-input-wrapper">
            <CreditCard size={18} />

            <input
              id="licenseNumber"
              type="text"
              inputMode="numeric"
              value={formData.licenseNumber}
              onChange={handleChange}
              placeholder="شماره گواهینامه را وارد کنید"
            />
          </div>
        </div>

        <div className="driver-form-group">
          <label>
            تاریخ اعتبار گواهینامه
          </label>

          <div className="driver-input-wrapper driver-date-wrapper">
            <CalendarDays size={18} />

            <PersianDatePicker
              value={licenseExpiry}
              onChange={setLicenseExpiry}
              placeholder="تاریخ اعتبار را انتخاب کنید"
            />
          </div>
        </div>

        {/* خطا */}

        {error && (
          <div className="driver-form-error driver-form-full">
            {error}
          </div>
        )}

        {/* دکمه */}

        <div className="driver-form-actions driver-form-full">
          <button
            type="button"
            className="driver-cancel-button"
            onClick={() => router.push("/drivers")}
            disabled={loading}
          >
            انصراف
          </button>

          <button
            type="submit"
            className="primary-action-button"
            disabled={loading}
          >
            <Save size={19} />

            <span>
              {loading
                ? "در حال ذخیره..."
                : "ذخیره راننده"}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}