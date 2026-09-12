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
    placeholder = "نام راننده را جستجو کنید...",
}) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const selectedDriver = drivers.find(
        (driver) => driver.id === value
    );

    const filteredDrivers = drivers.filter((driver) =>
        driver.name
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setOpen(false);
                setSearch("");
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    function openSearch() {
        setOpen(true);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    function handleSelect(driver) {
        onChange(driver.id);
        setSearch("");
        setOpen(false);
    }

    function handleClear(event) {
        event.stopPropagation();

        onChange("");
        setSearch("");
        setOpen(false);
    }

    function handleInputChange(event) {
        setSearch(event.target.value);
        setOpen(true);

        onChange("");
    }

    return (
        <div
            ref={wrapperRef}
            className="driver-picker"
        >
            <div
                className={`driver-picker-box ${open ? "driver-picker-box-open" : ""
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
                        onClick={(event) =>
                            event.stopPropagation()
                        }
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
                        className={`driver-picker-arrow ${open ? "driver-picker-arrow-open" : ""
                            }`}
                    />
                )}
            </div>

            {open && (
                <div className="driver-picker-dropdown">
                    <div className="driver-picker-dropdown-header">
                        {search.trim()
                            ? filteredDrivers.length > 0
                                ? `${filteredDrivers.length} راننده پیدا شد`
                                : "راننده‌ای پیدا نشد"
                            : "لیست رانندگان"}
                    </div>

                    <div className="driver-picker-list">
                        {filteredDrivers.length > 0 ? (
                            filteredDrivers.map((driver) => {
                                const selected =
                                    driver.id === value;

                                return (
                                    <button
                                        type="button"
                                        key={driver.id}
                                        className={`driver-picker-option ${selected
                                                ? "driver-picker-option-selected"
                                                : ""
                                            }`}
                                        onClick={() =>
                                            handleSelect(driver)
                                        }
                                    >
                                        <div className="driver-picker-avatar">
                                            <User size={16} />
                                        </div>

                                        <div className="driver-picker-info">
                                            <strong>
                                                {driver.name}
                                            </strong>

                                            <span>
                                                {driver.id}
                                                {driver.phone
                                                    ? ` • ${driver.phone}`
                                                    : ""}
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

                                <strong>
                                    راننده‌ای پیدا نشد
                                </strong>

                                <span>
                                    نام دیگری را جستجو کنید.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}