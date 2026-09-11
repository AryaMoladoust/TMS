"use client";

import Link from "next/link";

import {
    ArrowRight,
    Building2,
    Phone,
    UserRound,
    MapPin,
    FileText,
    Save,
} from "lucide-react";

export default function AddCompanyPage() {
    return (
        <main className="main-content">

            {/* Page Header */}

            <div className="page-heading page-heading-with-action">

                <div>
                    <div className="page-back-link">
                        <Link href="/companies">
                            <ArrowRight size={17} />
                            بازگشت به شرکت‌ها
                        </Link>
                    </div>

                    <h1>افزودن شرکت</h1>

                    <p>
                        اطلاعات شرکت جدید را وارد کنید
                    </p>
                </div>

            </div>


            {/* Form */}

            <section className="company-form-panel">

                <div className="company-form-header">

                    <div className="company-form-header-icon">
                        <Building2 size={24} />
                    </div>

                    <div>
                        <h2>اطلاعات شرکت</h2>

                        <p>
                            اطلاعات اصلی شرکت را وارد کنید
                        </p>
                    </div>

                </div>


                <form className="company-form">

                    {/* Company Name */}

                    <div className="company-form-group">

                        <label htmlFor="companyName">
                            نام شرکت
                            <span>*</span>
                        </label>

                        <div className="company-input-wrapper">
                            <Building2 size={18} />

                            <input
                                id="companyName"
                                type="text"
                                placeholder="مثلاً شرکت حمل‌ونقل شمال"
                            />
                        </div>

                    </div>


                    {/* Manager */}

                    <div className="company-form-group">

                        <label htmlFor="managerName">
                            نام مسئول شرکت
                            <span>*</span>
                        </label>

                        <div className="company-input-wrapper">
                            <UserRound size={18} />

                            <input
                                id="managerName"
                                type="text"
                                placeholder="نام و نام خانوادگی مسئول"
                            />
                        </div>

                    </div>


                    {/* Phone */}

                    <div className="company-form-group">

                        <label htmlFor="companyPhone">
                            شماره تماس
                            <span>*</span>
                        </label>

                        <div className="company-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="companyPhone"
                                type="tel"
                                placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
                            />
                        </div>

                    </div>

                    <div className="company-form-group">

                        <label htmlFor="companyLandline">
                            تلفن ثابت
                        </label>

                        <div className="company-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="companyLandline"
                                type="tel"
                                placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
                            />
                        </div>

                    </div>
                    {/* Address */}

                    <div className="company-form-group company-form-full">

                        <label htmlFor="companyAddress">
                            آدرس
                        </label>

                        <div className="company-input-wrapper company-textarea-wrapper">
                            <MapPin size={18} />

                            <textarea
                                id="companyAddress"
                                placeholder="آدرس شرکت را وارد کنید..."
                                rows={4}
                            />
                        </div>

                    </div>


                    {/* Description */}

                    <div className="company-form-group company-form-full">

                        <label htmlFor="companyDescription">
                            توضیحات
                        </label>

                        <div className="company-input-wrapper company-textarea-wrapper">
                            <FileText size={18} />

                            <textarea
                                id="companyDescription"
                                placeholder="توضیحات اضافی درباره شرکت..."
                                rows={4}
                            />
                        </div>

                    </div>


                    {/* Form Actions */}

                    <div className="company-form-actions">

                        <Link
                            href="/companies"
                            className="company-cancel-button"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            className="primary-action-button"
                        >
                            <Save size={19} />
                            <span>ذخیره شرکت</span>
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}