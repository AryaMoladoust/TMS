"use client";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

export default function LoadSearch({
  searchTerm = "",
  onSearchChange = () => {},
  statusFilter = "",
  onStatusChange = () => {},
  typeFilter = "",
  onTypeChange = () => {},
  vehicleFilter = "",
  onVehicleChange = () => {},
  onReset = () => {},
}) {
  return (
    <section className="load-search-panel">

      <div className="load-search-title">

        <div>
          <h2>
            جستجو و فیلتر بارها
          </h2>

          <p>
            برای پیدا کردن سریع بار از فیلترها استفاده کنید
          </p>
        </div>

        <SlidersHorizontal size={20} />

      </div>


      <div className="load-search-form">

        <div className="load-search-box">

          <Search size={19} />

          <input
            className="load-search-input"
            type="text"
            value={searchTerm}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="جستجو بر اساس شماره بار، شرکت، مبدا یا مقصد..."
          />

        </div>


        <select
          className="load-status-select"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(event.target.value)
          }
        >
          <option value="">
            همه وضعیت‌ها
          </option>

          <option value="undelivered">
            تحویل نشده
          </option>

          <option value="delivered">
            تحویل شده
          </option>
        </select>


        <select
          className="load-type-select"
          value={typeFilter}
          onChange={(event) =>
            onTypeChange(event.target.value)
          }
        >
          <option value="">
            همه انواع بار
          </option>

          <option value="food">
            مواد غذایی
          </option>

          <option value="industrial">
            قطعات صنعتی
          </option>

          <option value="construction">
            مصالح ساختمانی
          </option>

          <option value="agriculture">
            محصولات کشاورزی
          </option>
        </select>


        <select
          className="load-vehicle-select"
          value={vehicleFilter}
          onChange={(event) =>
            onVehicleChange(event.target.value)
          }
        >
          <option value="">
            همه خودروها
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
        </select>


        <button
          type="button"
          className="reset-filter-button"
          onClick={onReset}
        >
          <RotateCcw size={18} />

          پاک کردن
        </button>

      </div>

    </section>
  );
}
