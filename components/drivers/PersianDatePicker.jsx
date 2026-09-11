"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function PersianDatePicker({
    value,
    onChange,
    placeholder = "انتخاب تاریخ",
}) {
    return (
        <DatePicker
            value={value}
            onChange={onChange}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            format="YYYY/MM/DD"
            placeholder={placeholder}
            inputClass="persian-date-input"
            containerClassName="persian-date-container"
        />
    );
}