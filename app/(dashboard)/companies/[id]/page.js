"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
    ArrowRight,
    Building2,
    Phone,
    UserRound,
    MapPin,
    FileText,
    Pencil,
    Save,
    Trash2,
    X,
} from "lucide-react";

export default function CompanyDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editing, setEditing] = useState(false);

    const [form, setForm] = useState({
        name: "",
        managerName: "",
        phone: "",
        landline: "",
        address: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadCompany() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `/api/companies/${params.id}`
                );

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "خطا در دریافت اطلاعات شرکت."
                    );
                }

                setCompany(data.company);

                setForm({
                    name: data.company.name || "",
                    managerName:
                        data.company.managerName || "",
                    phone: data.company.phone || "",
                    landline:
                        data.company.landline || "",
                    address:
                        data.company.address || "",
                    description:
                        data.company.description || "",
                });
            } catch (error) {
                console.error(
                    "Load company error:",
                    error
                );

                setError(
                    error.message ||
                        "خطا در دریافت اطلاعات شرکت."
                );
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            loadCompany();
        }
    }, [params.id]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSave(event) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `/api/companies/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "خطا در ویرایش شرکت."
                );
            }

            setCompany(data.company);

            setForm({
                name: data.company.name || "",
                managerName:
                    data.company.managerName || "",
                phone: data.company.phone || "",
                landline:
                    data.company.landline || "",
                address:
                    data.company.address || "",
                description:
                    data.company.description || "",
            });

            setEditing(false);
            setSuccess(
                "اطلاعات شرکت با موفقیت ذخیره شد."
            );
        } catch (error) {
            console.error(
                "Update company error:",
                error
            );

            setError(
                error.message ||
                    "خطا در ویرایش شرکت."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            "آیا از حذف این شرکت مطمئن هستید؟"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const response = await fetch(
                `/api/companies/${params.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                        "خطا در حذف شرکت."
                );
            }

            router.push("/companies");
        } catch (error) {
            console.error(
                "Delete company error:",
                error
            );

            setError(
                error.message ||
                    "خطا در حذف شرکت."
            );
        } finally {
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <main className="main-content">
                <div className="company-form-panel">
                    <p
                        style={{
                            textAlign: "center",
                            padding: "40px",
                        }}
                    >
                        در حال دریافت اطلاعات شرکت...
                    </p>
                </div>
            </main>
        );
    }

    if (error && !company) {
        return (
            <main className="main-content">
                <div className="page-heading">
                    <div className="page-back-link">
                        <Link href="/companies">
                            <ArrowRight size={17} />
                            بازگشت به شرکت‌ها
                        </Link>
                    </div>
                    <h1>شرکت پیدا نشد</h1>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">

            <div className="page-heading page-heading-with-action">

                <div>

                    <div className="page-back-link">
                        <Link href="/companies">
                            <ArrowRight size={17} />
                            بازگشت به شرکت‌ها
                        </Link>
                    </div>

                    <h1>
                        {editing
                            ? "ویرایش شرکت"
                            : "اطلاعات شرکت"}
                    </h1>

                    <p>
                        مشاهده و مدیریت اطلاعات شرکت
                    </p>

                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                    }}
                >

                    {!editing && (
                        <>
                            <button
                                type="button"
                                className="primary-action-button"
                                onClick={() => {
                                    setEditing(true);
                                    setSuccess("");
                                    setError("");
                                }}
                            >
                                <Pencil size={18} />
                                <span>ویرایش</span>
                            </button>

                            <button
                                type="button"
                                className="company-delete-button"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                <Trash2 size={18} />

                                <span>
                                    {deleting
                                        ? "در حال حذف..."
                                        : "حذف شرکت"}
                                </span>
                            </button>
                        </>
                    )}

                </div>

            </div>

            {error && (
                <div className="company-form-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="company-form-success">
                    {success}
                </div>
            )}

            <section className="company-form-panel">

                <div className="company-form-header">

                    <div className="company-form-header-icon">
                        <Building2 size={24} />
                    </div>

                    <div>
                        <h2>
                            {company.name}
                        </h2>

                        <p>
                            شناسه شرکت: {company._id}
                        </p>
                    </div>

                </div>

                {editing ? (

                    <form
                        className="company-form"
                        onSubmit={handleSave}
                    >

                        <div className="company-form-group">
                            <label htmlFor="name">
                                نام شرکت
                                <span>*</span>
                            </label>

                            <div className="company-input-wrapper">
                                <Building2 size={18} />

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="company-form-group">
                            <label htmlFor="managerName">
                                نام مسئول شرکت
                                <span>*</span>
                            </label>

                            <div className="company-input-wrapper">
                                <UserRound size={18} />

                                <input
                                    id="managerName"
                                    name="managerName"
                                    type="text"
                                    value={
                                        form.managerName
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="company-form-group">
                            <label htmlFor="phone">
                                شماره تماس
                                <span>*</span>
                            </label>

                            <div className="company-input-wrapper">
                                <Phone size={18} />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="company-form-group">
                            <label htmlFor="landline">
                                تلفن ثابت
                            </label>

                            <div className="company-input-wrapper">
                                <Phone size={18} />

                                <input
                                    id="landline"
                                    name="landline"
                                    type="tel"
                                    value={
                                        form.landline
                                    }
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="company-form-group company-form-full">
                            <label htmlFor="address">
                                آدرس
                            </label>

                            <div className="company-input-wrapper company-textarea-wrapper">
                                <MapPin size={18} />

                                <textarea
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="company-form-group company-form-full">
                            <label htmlFor="description">
                                توضیحات
                            </label>

                            <div className="company-input-wrapper company-textarea-wrapper">
                                <FileText size={18} />

                                <textarea
                                    id="description"
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="company-form-actions">

                            <button
                                type="button"
                                className="company-cancel-button"
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <X size={18} />
                                انصراف
                            </button>

                            <button
                                type="submit"
                                className="primary-action-button"
                                disabled={saving}
                            >
                                <Save size={19} />

                                <span>
                                    {saving
                                        ? "در حال ذخیره..."
                                        : "ذخیره تغییرات"}
                                </span>
                            </button>

                        </div>

                    </form>

                ) : (

                    <div className="company-details-grid">

                        <div className="company-detail-item">
                            <span>نام شرکت</span>
                            <strong>{company.name}</strong>
                        </div>

                        <div className="company-detail-item">
                            <span>نام مسئول</span>
                            <strong>
                                {company.managerName}
                            </strong>
                        </div>

                        <div className="company-detail-item">
                            <span>شماره تماس</span>
                            <strong>
                                {company.phone}
                            </strong>
                        </div>

                        <div className="company-detail-item">
                            <span>تلفن ثابت</span>
                            <strong>
                                {company.landline || "ثبت نشده"}
                            </strong>
                        </div>

                        <div className="company-detail-item company-detail-full">
                            <span>آدرس</span>
                            <strong>
                                {company.address || "ثبت نشده"}
                            </strong>
                        </div>

                        <div className="company-detail-item company-detail-full">
                            <span>توضیحات</span>
                            <strong>
                                {company.description ||
                                    "توضیحی ثبت نشده است"}
                            </strong>
                        </div>

                    </div>

                )}

            </section>

        </main>
    );
}