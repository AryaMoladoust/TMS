"use client";

import Link from "next/link";
import { useState } from "react";
import PersianDatePicker from "@/components/drivers/PersianDatePicker";
import {
    ArrowRight,
    UserRound,
    Phone,
    MapPin,
    Truck,
    CreditCard,
    CalendarDays,
    Save,
} from "lucide-react";

export default function AddDriverPage() {
    const [licenseExpiry, setLicenseExpiry] = useState(null);

    return (
        <main className="main-content">
            <div className="page-heading page-heading-with-action">
                <div>
                    <div className="page-back-link">
                        <Link href="/drivers">
                            <ArrowRight size={17} />
                            بازگشت به رانندگان
                        </Link>
                    </div>

                    <h1>افزودن راننده</h1>
                    <p>اطلاعات راننده جدید را وارد کنید</p>
                </div>
            </div>

            <section className="driver-form-panel">
                <div className="driver-form-header">
                    <div className="driver-form-header-icon">
                        <UserRound size={24} />
                    </div>

                    <div>
                        <h2>اطلاعات راننده</h2>
                        <p>اطلاعات شخصی، خودرو و گواهینامه راننده را وارد کنید</p>
                    </div>
                </div>

                <form className="driver-form">
                    {/* اطلاعات شخصی */}

                    <div className="driver-form-section-title">
                        <UserRound size={19} />
                        <span>اطلاعات شخصی</span>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="driverName">
                            نام و نام خانوادگی <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <UserRound size={18} />

                            <input
                                id="driverName"
                                type="text"
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
                                placeholder="مثلاً ۱۲۳۴۵۶۷۸۹۰"
                                maxLength={10}
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="driverPhone">
                            شماره موبایل <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="driverPhone"
                                type="tel"
                                inputMode="tel"
                                placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="driverLandline">
                            تلفن ثابت
                        </label>

                        <div className="driver-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="driverLandline"
                                type="tel"
                                inputMode="tel"
                                placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
                            />
                        </div>
                    </div>

                    <div className="driver-form-group driver-form-full">
                        <label htmlFor="driverAddress">
                            آدرس
                        </label>

                        <div className="driver-input-wrapper driver-textarea-wrapper">
                            <MapPin size={18} />

                            <textarea
                                id="driverAddress"
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

                            <select id="vehicleType" defaultValue="">
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

                    <div className="driver-form-group">
                        <label htmlFor="vehiclePlate">
                            شماره پلاک <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <Truck size={18} />

                            <input
                                id="vehiclePlate"
                                type="text"
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
                                placeholder="شماره گواهینامه را وارد کنید"
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="licenseExpiry">
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

                    {/* دکمه‌ها */}

                    <div className="driver-form-actions">
                        <Link
                            href="/drivers"
                            className="driver-cancel-button"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            className="primary-action-button"
                        >
                            <Save size={19} />
                            <span>ذخیره راننده</span>
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}