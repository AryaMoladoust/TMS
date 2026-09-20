"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
    ArrowRight,
    UserRound,
    Phone,
    MapPin,
    Truck,
    CreditCard,
    CalendarDays,
    Pencil,
    Trash2,
    LoaderCircle,
} from "lucide-react";

export default function DriverDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDriver() {
            try {
                const response = await fetch(`/api/drivers/${params.id}`);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "خطا در دریافت اطلاعات راننده"
                    );
                }

                setDriver(data.driver);
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

    async function handleDelete() {
        const confirmed = window.confirm(
            `آیا از حذف راننده «${driver?.name}» مطمئن هستید؟`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            const response = await fetch(
                `/api/drivers/${params.id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "خطا در حذف راننده"
                );
            }

            router.push("/drivers");
            router.refresh();
        } catch (error) {
            setError(error.message);
            setDeleting(false);
        }
    }

    function getVehicleType(type) {
        const types = {
            truck: "کامیون",
            trailer: "تریلی",
            pickup: "نیسان",
            van: "وانت",
        };

        return types[type] || type;
    }

    function getStatus(status) {
        const statuses = {
            available: "آماده",
            busy: "مشغول",
            inactive: "غیرفعال",
        };

        return statuses[status] || status;
    }

    if (loading) {
        return (
            <main className="main-content">
                <div className="driver-loading">
                    <LoaderCircle size={28} className="loading-spinner" />
                    <span>در حال دریافت اطلاعات راننده...</span>
                </div>
            </main>
        );
    }

    if (error || !driver) {
        return (
            <main className="main-content">
                <div className="driver-error">
                    <p>{error || "راننده پیدا نشد"}</p>

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
            <div className="page-heading page-heading-with-action">
                <div>
                    <div className="page-back-link">
                        <Link href="/drivers">
                            <ArrowRight size={17} />
                            بازگشت به رانندگان
                        </Link>
                    </div>

                    <h1>{driver.name}</h1>

                    <p>
                        مشاهده و مدیریت اطلاعات راننده
                    </p>
                </div>

                <div className="driver-detail-actions">
                    <Link
                        href={`/drivers/${driver._id}/edit`}
                        className="primary-action-button"
                    >
                        <Pencil size={18} />
                        ویرایش راننده
                    </Link>

                    <button
                        type="button"
                        className="driver-delete-button"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <LoaderCircle
                                size={18}
                                className="loading-spinner"
                            />
                        ) : (
                            <Trash2 size={18} />
                        )}

                        حذف راننده
                    </button>
                </div>
            </div>

            <section className="driver-detail-panel">
                <div className="driver-detail-header">
                    <div className="driver-detail-avatar">
                        <UserRound size={30} />
                    </div>

                    <div>
                        <h2>{driver.name}</h2>

                        <span>
                            وضعیت: {getStatus(driver.status)}
                        </span>
                    </div>
                </div>

                <div className="driver-detail-grid">
                    <div className="driver-detail-card">
                        <UserRound size={20} />
                        <div>
                            <span>کد ملی</span>
                            <strong>{driver.nationalId}</strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <Phone size={20} />
                        <div>
                            <span>شماره موبایل</span>
                            <strong>{driver.phone}</strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <Phone size={20} />
                        <div>
                            <span>تلفن ثابت</span>
                            <strong>
                                {driver.landline || "ثبت نشده"}
                            </strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <Truck size={20} />
                        <div>
                            <span>نوع خودرو</span>
                            <strong>
                                {getVehicleType(driver.vehicleType)}
                            </strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <Truck size={20} />
                        <div>
                            <span>شماره پلاک</span>
                            <strong>{driver.vehiclePlate}</strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <CreditCard size={20} />
                        <div>
                            <span>شماره گواهینامه</span>
                            <strong>{driver.licenseNumber}</strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <CalendarDays size={20} />
                        <div>
                            <span>اعتبار گواهینامه</span>
                            <strong>
                                {driver.licenseExpiry || "ثبت نشده"}
                            </strong>
                        </div>
                    </div>

                    <div className="driver-detail-card">
                        <MapPin size={20} />
                        <div>
                            <span>آدرس</span>
                            <strong>
                                {driver.address || "ثبت نشده"}
                            </strong>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}