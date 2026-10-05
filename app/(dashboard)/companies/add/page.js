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

import { useNotification } from "@/components/ui/NotificationProvider";

export default function AddCompanyPage() {
    /* =========================================================
       NOTIFICATION SYSTEM
    ========================================================= */

    const {
        showSuccess,
        showError,
        showWarning,
    } = useNotification();

    /* =========================================================
       FORM STATE
    ========================================================= */

    const [formData, setFormData] = useState({
        name: "",
        managerName: "",
        phone: "",
        landline: "",
        address: "",
        description: "",
    });

    const [saving, setSaving] = useState(false);

    /* =========================================================
       CHANGE FIELDS
    ========================================================= */

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

    /* =========================================================
       SUBMIT COMPANY
    ========================================================= */

    async function handleSubmit(event) {
        event.preventDefault();

        /* ======================================
           REQUIRED FIELDS
        ====================================== */

        if (
            !formData.name.trim() ||
            !formData.managerName.trim() ||
            !formData.phone.trim()
        ) {
            showWarning(
                "لطفاً نام شرکت، نام مسئول و شماره تماس را وارد کنید.",
                "اطلاعات ناقص"
            );

            return;
        }

        /* ======================================
           SEND TO API
        ====================================== */

        try {
            setSaving(true);

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

            /* ==================================
               API ERROR
            ================================== */

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "خطا در ثبت شرکت"
                );
            }

            /* ==================================
               SUCCESS
            ================================== */

            showSuccess(
                "شرکت با موفقیت ثبت شد.",
                "ثبت شرکت موفق"
            );

            /*
             * کمی تأخیر می‌دهیم تا کاربر
             * پیام موفقیت را ببیند.
             */
            setTimeout(() => {
                window.location.href =
                    "/companies";
            }, 700);

        } catch (error) {
            console.error(
                "خطا در ثبت شرکت:",
                error
            );

            showError(
                error.message ||
                "ثبت شرکت با خطا مواجه شد.",
                "خطا در ثبت شرکت"
            );
        } finally {
            setSaving(false);
        }
    }

    /* =========================================================
       RENDER
    ========================================================= */

    return (
        <main className="main-content">

            {/* =================================
                PAGE HEADER
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
                FORM
            ================================== */}

            <section className="company-form-panel">

                {/* =================================
                    FORM HEADER
                ================================== */}

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


                <form
                    className="company-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================
                        COMPANY NAME
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
                        MANAGER
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
                        PHONE
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
                                placeholder="مثلاً 09123456789"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        LANDLINE
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
                        ADDRESS
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
                        DESCRIPTION
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
                        ACTIONS
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