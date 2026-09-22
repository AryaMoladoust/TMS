"use client";

import Link from "next/link";
import { useState } from "react";

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

    const [formData, setFormData] = useState({
        name: "",
        managerName: "",
        phone: "",
        landline: "",
        address: "",
        description: "",
    });


    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // تغییر فیلدها
    // ==========================================

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }


    // ==========================================
    // ثبت شرکت
    // ==========================================

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");


        // ======================================
        // بررسی فیلدهای اجباری
        // ======================================

        if (
            !formData.name.trim() ||
            !formData.managerName.trim() ||
            !formData.phone.trim()
        ) {

            setError(
                "لطفاً نام شرکت، نام مسئول و شماره تماس را وارد کنید."
            );

            return;
        }


        try {

            setSaving(true);


            // ==================================
            // ارسال به API
            // ==================================

            const response = await fetch(
                "/api/companies",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        formData
                    ),
                }
            );


            const data =
                await response.json();


            // ==================================
            // خطای API
            // ==================================

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "خطا در ثبت شرکت"
                );
            }


            // ==================================
            // ثبت موفق
            // ==================================

            window.location.href =
                "/companies";

        } catch (error) {

            console.error(
                "خطا در ثبت شرکت:",
                error
            );

            setError(
                error.message ||
                "ثبت شرکت با خطا مواجه شد."
            );

        } finally {

            setSaving(false);

        }
    }


    return (
        <main className="main-content">

            {/* =================================
                Page Header
            ================================== */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <div className="page-back-link">

                        <Link href="/companies">

                            <ArrowRight size={17} />

                            بازگشت به شرکت‌ها

                        </Link>

                    </div>


                    <h1>
                        افزودن شرکت
                    </h1>


                    <p>
                        اطلاعات شرکت جدید را وارد کنید
                    </p>

                </div>

            </div>


            {/* =================================
                Form
            ================================== */}

            <section className="company-form-panel">


                <div className="company-form-header">

                    <div className="company-form-header-icon">

                        <Building2 size={24} />

                    </div>


                    <div>

                        <h2>
                            اطلاعات شرکت
                        </h2>


                        <p>
                            اطلاعات اصلی شرکت را وارد کنید
                        </p>

                    </div>

                </div>


                {/* =================================
                    Error
                ================================== */}

                {error && (

                    <div className="company-form-error">

                        {error}

                    </div>

                )}


                <form
                    className="company-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        Company Name
                    ================================== */}

                    <div className="company-form-group">

                        <label htmlFor="companyName">

                            نام شرکت

                            <span>
                                *
                            </span>

                        </label>


                        <div className="company-input-wrapper">

                            <Building2 size={18} />


                            <input
                                id="companyName"
                                name="name"
                                type="text"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="مثلاً شرکت حمل‌ونقل شمال"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        Manager
                    ================================== */}

                    <div className="company-form-group">

                        <label htmlFor="managerName">

                            نام مسئول شرکت

                            <span>
                                *
                            </span>

                        </label>


                        <div className="company-input-wrapper">

                            <UserRound size={18} />


                            <input
                                id="managerName"
                                name="managerName"
                                type="text"
                                value={
                                    formData.managerName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="نام و نام خانوادگی مسئول"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        Phone
                    ================================== */}

                    <div className="company-form-group">

                        <label htmlFor="companyPhone">

                            شماره تماس

                            <span>
                                *
                            </span>

                        </label>


                        <div className="company-input-wrapper">

                            <Phone size={18} />


                            <input
                                id="companyPhone"
                                name="phone"
                                type="tel"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        Landline
                    ================================== */}

                    <div className="company-form-group">

                        <label htmlFor="companyLandline">

                            تلفن ثابت

                        </label>


                        <div className="company-input-wrapper">

                            <Phone size={18} />


                            <input
                                id="companyLandline"
                                name="landline"
                                type="tel"
                                value={
                                    formData.landline
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="مثلاً ۰۱۳۳۳۳۳۴۵۶۷"
                            />

                        </div>

                    </div>


                    {/* =================================
                        Address
                    ================================== */}

                    <div className="company-form-group company-form-full">

                        <label htmlFor="companyAddress">

                            آدرس

                        </label>


                        <div className="company-input-wrapper company-textarea-wrapper">

                            <MapPin size={18} />


                            <textarea
                                id="companyAddress"
                                name="address"
                                value={
                                    formData.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="آدرس شرکت را وارد کنید..."
                                rows={4}
                            />

                        </div>

                    </div>


                    {/* =================================
                        Description
                    ================================== */}

                    <div className="company-form-group company-form-full">

                        <label htmlFor="companyDescription">

                            توضیحات

                        </label>


                        <div className="company-input-wrapper company-textarea-wrapper">

                            <FileText size={18} />


                            <textarea
                                id="companyDescription"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="توضیحات اضافی درباره شرکت..."
                                rows={4}
                            />

                        </div>

                    </div>


                    {/* =================================
                        Error
                    ================================== */}

                    {error && (

                        <div
                            className="company-form-error company-form-full"
                        >
                            {error}
                        </div>

                    )}


                    {/* =================================
                        Actions
                    ================================== */}

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
                            disabled={saving}
                        >

                            <Save size={19} />


                            <span>

                                {saving
                                    ? "در حال ذخیره..."
                                    : "ذخیره شرکت"}

                            </span>

                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}