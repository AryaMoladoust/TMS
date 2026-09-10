"use client";

import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function DriverSearch() {
  function resetFilters() {
    document.querySelector(".driver-search-input").value = "";
    document.querySelector(".driver-search-select").value = "";
    document.querySelector(".driver-status-select").value = "";
  }

  return (
    <section className="driver-search-panel">

      <div className="driver-search-title">
        <div>
          <h2>جستجو و فیلتر رانندگان</h2>
          <p>برای پیدا کردن سریع راننده از فیلترها استفاده کنید</p>
        </div>

        <SlidersHorizontal size={20} />
      </div>

      <div className="driver-search-form">

        <div className="driver-search-box">
          <Search size={19} />

          <input
            className="driver-search-input"
            type="text"
            placeholder="جستجو بر اساس نام، کد ملی یا شماره موبایل..."
          />
        </div>

        <select className="driver-search-select" defaultValue="">
          <option value="">همه خودروها</option>
          <option value="truck">کامیون</option>
          <option value="trailer">تریلی</option>
          <option value="pickup">نیسان</option>
          <option value="van">وانت</option>
        </select>

        <select className="driver-status-select" defaultValue="">
          <option value="">همه وضعیت‌ها</option>
          <option value="available">آماده</option>
          <option value="busy">مشغول</option>
          <option value="inactive">غیرفعال</option>
        </select>

        <button
          type="button"
          className="reset-filter-button"
          onClick={resetFilters}
          title="پاک کردن فیلترها"
        >
          <RotateCcw size={18} />
          پاک کردن
        </button>

      </div>

    </section>
  );
}