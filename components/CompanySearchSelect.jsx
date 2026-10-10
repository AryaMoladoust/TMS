
"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, LoaderCircle, Search, X } from "lucide-react";

export default function CompanySearchSelect({
  value,
  onChange,
  required = true,
}) {
  const [search, setSearch] = useState(value?.name || "");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const wrapperRef = useRef(null);
  const selectedRef = useRef(false);

  useEffect(() => {
    setSearch(value?.name || "");
  }, [value]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: "1",
          limit: "50",
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/companies?${params.toString()}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "دریافت شرکت‌ها ناموفق بود");
        }

        if (!cancelled) {
          const list = Array.isArray(result)
            ? result
            : result.companies || [];

          setCompanies(list);
        }
      } catch (err) {
        if (!cancelled) {
          setCompanies([]);
          setError(err.message || "خطا در دریافت شرکت‌ها");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, open]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function selectCompany(company) {
    selectedRef.current = true;
    onChange(company);
    setSearch(company.name || "");
    setOpen(false);
  }

  function clearSelection() {
    onChange(null);
    setSearch("");
    setCompanies([]);
    setOpen(true);
  }

  return (
    <div className="company-select" ref={wrapperRef}>


      <div
        className={`company-select__input-wrap ${
          open ? "company-select__input-wrap--open" : ""
        }`}
      >
        <Search size={19} className="company-select__search-icon" />

        <input
          id="loadCompanySearch"
          type="text"
          value={search}
          autoComplete="off"
          placeholder="نام شرکت را جستجو کنید..."
          required={required && !value}
          onFocus={() => {
            selectedRef.current = false;
            setOpen(true);
          }}
          onChange={(event) => {
            const nextValue = event.target.value;

            setSearch(nextValue);
            setOpen(true);

            if (value && nextValue !== value.name) {
              onChange(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);

            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }

            if (event.key === "Enter" && open) {
              event.preventDefault();

              if (companies.length === 1) {
                selectCompany(companies[0]);
              }
            }
          }}
        />

        {loading ? (
          <LoaderCircle
            size={18}
            className="company-select__spinner"
          />
        ) : value ? (
          <button
            type="button"
            className="company-select__icon-button"
            onClick={clearSelection}
            aria-label="پاک کردن شرکت انتخاب‌شده"
          >
            <X size={18} />
          </button>
        ) : (
          <ChevronDown
            size={18}
            className="company-select__chevron"
          />
        )}
      </div>

      {open && (
        <div className="company-select__dropdown">
          {loading ? (
            <div className="company-select__message">
              <LoaderCircle size={18} className="company-select__spinner" />
              در حال جستجوی شرکت‌ها...
            </div>
          ) : error ? (
            <div className="company-select__message company-select__error">
              {error}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => setOpen(true), 0);
                }}
              >
                تلاش مجدد
              </button>
            </div>
          ) : companies.length === 0 ? (
            <div className="company-select__message">
              شرکتی با این نام پیدا نشد.
            </div>
          ) : (
            companies.map((company) => {
              const isSelected = value?._id === company._id;

              return (
                <button
                  type="button"
                  key={company._id}
                  className={`company-select__option ${
                    isSelected
                      ? "company-select__option--selected"
                      : ""
                  }`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCompany(company)}
                >
                  <span className="company-select__building">
                    <Building2 size={19} />
                  </span>

                  <span className="company-select__company-name">
                    {company.name}
                  </span>

                  {isSelected && (
                    <Check
                      size={18}
                      className="company-select__check"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}

      {value && (
        <div className="company-select__selected">
          <Check size={15} />
          شرکت انتخاب شد: {value.name}
        </div>
      )}
    </div>
  );
}