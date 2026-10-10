"use client";

import { useEffect, useRef, useState } from "react";
import {
Check,
ChevronDown,
Search,
User,
X,
} from "lucide-react";

export default function DriverSearchSelect({
drivers = [],
value,
onChange,
onSearch,
loading = false,
placeholder = "نام راننده را جستجو کنید...",
}) {
const [search, setSearch] = useState("");
const [open, setOpen] = useState(false);
const [cachedDriver, setCachedDriver] = useState(null);

const wrapperRef = useRef(null);
const inputRef = useRef(null);

const selectedDriver =
    drivers.find((driver) => driver._id === value) ||
    (cachedDriver?._id === value ? cachedDriver : null);

// ارسال جستجو به سرور، با تأخیر کوتاه
useEffect(() => {
    if (!open || typeof onSearch !== "function") return;

    const timeout = setTimeout(() => {
        onSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
}, [search, open, onSearch]);

// نگه‌داشتن اطلاعات راننده انتخاب‌شده،
// حتی وقتی نتیجه جستجو تغییر می‌کند
useEffect(() => {
    const found = drivers.find((driver) => driver._id === value);

    if (found) {
        setCachedDriver(found);
    }
}, [drivers, value]);

useEffect(() => {
    function handleClickOutside(event) {
        if (
            wrapperRef.current &&
            !wrapperRef.current.contains(event.target)
        ) {
            setOpen(false);
            setSearch("");

            if (typeof onSearch === "function") {
                onSearch("");
            }
        }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener(
            "mousedown",
            handleClickOutside
        );
    };
}, [onSearch]);

function openSearch() {
    setOpen(true);

    setTimeout(() => {
        inputRef.current?.focus();
    }, 0);
}

function handleSelect(driver) {
    setCachedDriver(driver);
    onChange(driver._id);
    setSearch("");
    setOpen(false);

    if (typeof onSearch === "function") {
        onSearch("");
    }
}

function handleClear(event) {
    event.stopPropagation();

    onChange("");
    setCachedDriver(null);
    setSearch("");
    setOpen(false);

    if (typeof onSearch === "function") {
        onSearch("");
    }
}

function handleInputChange(event) {
    setSearch(event.target.value);
    setOpen(true);

    if (value) {
        onChange("");
    }
}

return (
    <div ref={wrapperRef} className="driver-picker">
        <div
            className={`driver-picker-box ${
                open ? "driver-picker-box-open" : ""
            }`}
            onClick={openSearch}
        >
            <Search
                size={17}
                className="driver-picker-search-icon"
            />

            {selectedDriver && !open ? (
                <div className="driver-picker-selected">
                    <span>{selectedDriver.name}</span>
                </div>
            ) : (
                <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    placeholder={
                        selectedDriver
                            ? selectedDriver.name
                            : placeholder
                    }
                    onClick={(event) => event.stopPropagation()}
                />
            )}

            {selectedDriver && !open ? (
                <button
                    type="button"
                    className="driver-picker-clear"
                    onClick={handleClear}
                    aria-label="پاک کردن راننده"
                >
                    <X size={15} />
                </button>
            ) : (
                <ChevronDown
                    size={17}
                    className={`driver-picker-arrow ${
                        open ? "driver-picker-arrow-open" : ""
                    }`}
                />
            )}
        </div>

        {open && (
            <div className="driver-picker-dropdown">
                <div className="driver-picker-dropdown-header">
                    {loading
                        ? "در حال جستجو..."
                        : search.trim()
                          ? drivers.length > 0
                              ? `${drivers.length} نتیجه در این صفحه`
                              : "راننده‌ای پیدا نشد"
                          : "۲۰ راننده اول"}
                </div>

                <div className="driver-picker-list">
                    {loading ? (
                        <div className="driver-picker-empty">
                            <Search size={25} />
                            <strong>در حال جستجوی رانندگان...</strong>
                            <span>لطفاً کمی صبر کنید.</span>
                        </div>
                    ) : drivers.length > 0 ? (
                        drivers.map((driver) => {
                            const selected = driver._id === value;

                            return (
                                <button
                                    type="button"
                                    key={driver._id}
                                    className={`driver-picker-option ${
                                        selected
                                            ? "driver-picker-option-selected"
                                            : ""
                                    }`}
                                    onClick={() => handleSelect(driver)}
                                >
                                    <div className="driver-picker-avatar">
                                        <User size={16} />
                                    </div>

                                    <div className="driver-picker-info">
                                        <strong>{driver.name}</strong>
                                        <span>
                                            {driver.phone || "بدون شماره تماس"}
                                        </span>
                                    </div>

                                    {selected && (
                                        <Check
                                            size={17}
                                            className="driver-picker-check"
                                        />
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="driver-picker-empty">
                            <Search size={25} />
                            <strong>راننده‌ای پیدا نشد</strong>
                            <span>
                                نام یا شماره تماس دیگری را جستجو کنید.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
);


}
