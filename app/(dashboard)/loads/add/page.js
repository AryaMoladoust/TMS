"use client";

import Link from "next/link";
import {
    ArrowRight,
    Package,
    Building2,
    MapPin,
    Route,
    Truck,
    FileText,
    Save,
    Navigation,
    Tag,
} from "lucide-react";

export default function AddLoadPage() {
    return (
        <main className="main-content">
            <div className="page-heading page-heading-with-action">
                <div>
                    <div className="page-back-link">
                        <Link href="/loads">
                            <ArrowRight size={17} />
                            بازگشت به بارها
                        </Link>
                    </div>

                    <h1>افزودن بار</h1>
                    <p>اطلاعات بار جدید را وارد کنید</p>
                </div>
            </div>

            <section className="load-form-panel">

                {/* Header */}
                <div className="load-form-header">
                    <div className="load-form-header-icon">
                        <Package size={24} />
                    </div>

                    <div>
                        <h2>اطلاعات بار</h2>
                        <p>
                            اطلاعات شرکت، نوع بار، مسیر و مشخصات حمل را وارد کنید
                        </p>
                    </div>
                </div>

                <form className="load-form">

                    {/* عنوان بار */}
                    <div className="load-form-group load-form-full">
                        <label htmlFor="loadTitle">
                            عنوان بار <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Tag size={18} />

                            <input
                                id="loadTitle"
                                type="text"
                                placeholder="مثلاً بار مواد غذایی رشت به تهران"
                            />
                        </div>
                    </div>

                    {/* شرکت */}
                    <div className="load-form-group">
                        <label htmlFor="loadCompany">
                            شرکت <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Building2 size={18} />

                            <select id="loadCompany" defaultValue="">
                                <option value="" disabled>
                                    شرکت را انتخاب کنید
                                </option>

                                <option value="COM-1001">
                                    شرکت حمل‌ونقل شمال
                                </option>

                                <option value="COM-1002">
                                    صنایع شمال
                                </option>

                                <option value="COM-1003">
                                    بازرگانی گیلان
                                </option>

                                <option value="COM-1004">
                                    شرکت ساختمانی شمال
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* نوع بار */}
                    <div className="load-form-group">
                        <label htmlFor="loadType">
                            نوع بار <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Package size={18} />

                            <select id="loadType" defaultValue="">
                                <option value="" disabled>
                                    نوع بار را انتخاب کنید
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

                                <option value="other">
                                    سایر
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* مسیر */}
                    <div className="load-form-section-title load-form-full">
                        <MapPin size={19} />
                        <span>مسیر بار</span>
                    </div>

                    {/* مبدأ */}
                    <div className="load-form-group">
                        <label htmlFor="loadOrigin">
                            مبدأ <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <MapPin size={18} />

                            <input
                                id="loadOrigin"
                                type="text"
                                placeholder=" رشت"
                            />
                        </div>
                    </div>

                    {/* مقصد */}
                    <div className="load-form-group">
                        <label htmlFor="loadDestination">
                            مقصد <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Navigation size={18} />

                            <input
                                id="loadDestination"
                                type="text"
                                placeholder=" تهران"
                            />
                        </div>
                    </div>
                    {/* آدرس بار */}
                    <div className="load-form-group load-form-full">
                        <label htmlFor="loadAddress">
                            آدرس بار <span>*</span>
                        </label>

                        <div className="load-input-wrapper load-textarea-wrapper">
                            <MapPin size={18} />

                            <textarea
                                id="loadAddress"
                                rows={3}
                                placeholder="آدرس دقیق محل  را وارد کنید..."
                            />
                        </div>
                    </div>
                    {/* مسافت */}
                    <div className="load-form-group">
                        <label htmlFor="loadDistance">
                            مسافت <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Route size={18} />

                            <input
                                id="loadDistance"
                                type="number"
                                min="0"
                                placeholder=" ۳۲۵"
                            />

                            <span className="load-input-unit">
                                کیلومتر
                            </span>
                        </div>
                    </div>

                    {/* وضعیت مسیر */}
                    <div className="load-form-group">
                        <label htmlFor="loadProvinceStatus">
                            وضعیت مسیر <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <MapPin size={18} />

                            <select
                                id="loadProvinceStatus"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    وضعیت مسیر را انتخاب کنید
                                </option>

                                <option value="inside">
                                    داخل استان
                                </option>

                                <option value="outside">
                                    خارج استان
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* نوع خودرو */}
                    <div className="load-form-section-title load-form-full">
                        <Truck size={19} />
                        <span>نوع خودرو</span>
                    </div>

                    <div className="load-form-group">
                        <label htmlFor="loadVehicleType">
                            نوع خودرو <span>*</span>
                        </label>

                        <div className="load-input-wrapper">
                            <Truck size={18} />

                            <select
                                id="loadVehicleType"
                                defaultValue=""
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

                    {/* توضیحات */}
                    <div className="load-form-section-title load-form-full">
                        <FileText size={19} />
                        <span>توضیحات</span>
                    </div>

                    <div className="load-form-group load-form-full">
                        <label htmlFor="loadDescription">
                            توضیحات بار
                        </label>

                        <div className="load-input-wrapper load-textarea-wrapper">
                            <FileText size={18} />

                            <textarea
                                id="loadDescription"
                                rows={4}
                                placeholder="توضیحات اضافی درباره بار..."
                            />
                        </div>
                    </div>

                    {/* دکمه‌ها */}
                    <div className="load-form-actions">
                        <Link
                            href="/loads"
                            className="load-cancel-button"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            className="primary-action-button"
                        >
                            <Save size={19} />
                            <span>ذخیره بار</span>
                        </button>
                    </div>

                </form>
            </section>
        </main>
    );
}