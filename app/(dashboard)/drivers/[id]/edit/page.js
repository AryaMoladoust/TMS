"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    LoaderCircle,
} from "lucide-react";

export default function EditDriverPage() {
    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        nationalId: "",
        phone: "",
        landline: "",
        address: "",
        vehicleType: "",
        vehiclePlate: "",
        licenseNumber: "",
        status: "available",
    });

    const [licenseExpiry, setLicenseExpiry] =
        useState(null);

    useEffect(() => {
        async function loadDriver() {
            try {
                const response = await fetch(
                    `/api/drivers/${params.id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "خطا در دریافت اطلاعات راننده"
                    );
                }

                const driver = data.driver;

                setFormData({
                    name: driver.name || "",
                    nationalId: driver.nationalId || "",
                    phone: driver.phone || "",
                    landline: driver.landline || "",
                    address: driver.address || "",
                    vehicleType: driver.vehicleType || "",
                    vehiclePlate: driver.vehiclePlate || "",
                    licenseNumber: driver.licenseNumber || "",
                    status: driver.status || "available",
                });

                if (driver.licenseExpiry) {
                    setLicenseExpiry(driver.licenseExpiry);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            loadDriver();
        }
    }, [params.id]);

    function handleChange(event) {
        const { id, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [id]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            !formData.name ||
            !formData.nationalId ||
            !formData.phone ||
            !formData.vehicleType ||
            !formData.vehiclePlate ||
            !formData.licenseNumber
        ) {
            setError(
                "لطفاً تمام فیلدهای الزامی را تکمیل کنید."
            );
            return;
        }

        if (!/^\d{10}$/.test(formData.nationalId)) {
            setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                `/api/drivers/${params.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        licenseExpiry:
                            typeof licenseExpiry === "object" &&
                                licenseExpiry?.format
                                ? licenseExpiry.format("YYYY/MM/DD")
                                : licenseExpiry || "",
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "خطا در ویرایش راننده"
                );
            }

            router.push(`/drivers/${params.id}`);
            router.refresh();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="main-content">
                <div className="driver-loading">
                    <LoaderCircle
                        size={28}
                        className="loading-spinner"
                    />
                    <span>
                        در حال دریافت اطلاعات راننده...
                    </span>
                </div>
            </main>
        );
    }

    if (error && !formData.name) {
        return (
            <main className="main-content">
                <div className="driver-error">
                    <p>{error}</p>

                    <Link
                        href="/drivers"
                        className="primary-action-button"
                    >
                        بازگشت به رانندگان
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="main-content">
            <div className="page-heading">
                <div>
                    <div className="page-back-link">
                        <Link href={`/drivers/${params.id}`}>
                            <ArrowRight size={17} />
                            بازگشت به پرونده راننده
                        </Link>
                    </div>

                    <h1>ویرایش راننده</h1>

                    <p>
                        اطلاعات {formData.name} را ویرایش کنید
                    </p>
                </div>
            </div>

            <section className="driver-form-panel">
                <div className="driver-form-header">
                    <div className="driver-form-header-icon">
                        <PencilIcon />
                    </div>

                    <div>
                        <h2>ویرایش اطلاعات راننده</h2>
                        <p>
                            اطلاعات شخصی، خودرو و گواهینامه
                        </p>
                    </div>
                </div>

                <form
                    className="driver-form"
                    onSubmit={handleSubmit}
                >
                    <div className="driver-form-section-title">
                        <UserRound size={19} />
                        <span>اطلاعات شخصی</span>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="name">
                            نام و نام خانوادگی <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <UserRound size={18} />

                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
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
                                maxLength={10}
                                value={formData.nationalId}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="phone">
                            شماره موبایل <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label htmlFor="landline">
                            تلفن ثابت
                        </label>

                        <div className="driver-input-wrapper">
                            <Phone size={18} />

                            <input
                                id="landline"
                                type="tel"
                                value={formData.landline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="driver-form-group driver-form-full">
                        <label htmlFor="address">
                            آدرس
                        </label>

                        <div className="driver-input-wrapper driver-textarea-wrapper">
                            <MapPin size={18} />

                            <textarea
                                id="address"
                                rows={4}
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

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

                            <select
                                id="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                            >
                                <option value="">
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

                    <div className="driver-form-group">
                        <label htmlFor="vehiclePlate">
                            شماره پلاک <span>*</span>
                        </label>

                        <div className="driver-input-wrapper">
                            <Truck size={18} />

                            <input
                                id="vehiclePlate"
                                type="text"
                                value={formData.vehiclePlate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

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
                                value={formData.licenseNumber}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="driver-form-group">
                        <label>
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

                    <div className="driver-form-group">
                        <label htmlFor="status">
                            وضعیت راننده
                        </label>

                        <div className="driver-input-wrapper">
                            <UserRound size={18} />

                            <select
                                id="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="available">
                                    آماده
                                </option>

                                <option value="busy">
                                    مشغول
                                </option>

                                <option value="inactive">
                                    غیرفعال
                                </option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="driver-form-error driver-form-full">
                            {error}
                        </div>
                    )}

                    <div className="driver-form-actions driver-form-full">
                        <Link
                            href={`/drivers/${params.id}`}
                            className="driver-cancel-button"
                        >
                            انصراف
                        </Link>

                        <button
                            type="submit"
                            className="primary-action-button"
                            disabled={saving}
                        >
                            {saving ? (
                                <LoaderCircle
                                    size={19}
                                    className="loading-spinner"
                                />
                            ) : (
                                <Save size={19} />
                            )}

                            <span>
                                {saving
                                    ? "در حال ذخیره..."
                                    : "ذخیره تغییرات"}
                            </span>
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

function PencilIcon() {
    return (
        <PencilIconInner />
    );
}

function PencilIconInner() {
    return <span style={{ fontSize: "20px" }}>✎</span>;
}