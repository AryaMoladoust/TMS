"use client";

import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function CompanySearch() {
  function resetFilters() {
    const search = document.querySelector(".company-search-input");

    if (search) {
      search.value = "";
    }
  }

  return (
    <section className="company-search-panel">

      <div className="company-search-title">

        <div>
          <h2>
            جستجوی شرکت
          </h2>

          <p>
            برای پیدا کردن سریع شرکت موردنظر جستجو کنید
          </p>
        </div>

        <SlidersHorizontal size={20} />

      </div>


      <div className="company-search-form">

        <div className="company-search-box">

          <Search size={19} />

          <input
            className="company-search-input"
            type="text"
            placeholder="جستجو بر اساس نام شرکت، شماره تماس یا نام مسئول..."
          />

        </div>


        <button
          type="button"
          className="reset-filter-button"
          onClick={resetFilters}
        >
          <RotateCcw size={18} />

          پاک کردن
        </button>

      </div>

    </section>
  );
}