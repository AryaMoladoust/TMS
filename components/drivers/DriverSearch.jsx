"use client";

import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function DriverSearch({ filters, setFilters }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      search: "",
      vehicleType: "",
      licenseStatus: "",
    });
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
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="جستجو بر اساس نام، کد ملی یا شماره موبایل..."
          />
        </div>

        <select
          className="driver-search-select"
          name="vehicleType"
          value={filters.vehicleType}
          onChange={handleChange}
        >
          <option value="">همه خودروها</option>
          <option value="truck">کامیون</option>
          <option value="trailer">تریلی</option>
          <option value="pickup">نیسان</option>
          <option value="van">وانت</option>
        </select>

        <select
          className="driver-status-select"
          name="licenseStatus"
          value={filters.licenseStatus}
          onChange={handleChange}
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="valid">معتبر</option>
          <option value="warning">نزدیک به انقضا</option>
          <option value="expired">منقضی</option>
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