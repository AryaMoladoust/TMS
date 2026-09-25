"use client";

import {
    ArrowRight,
    CalendarDays,
    Car,
    FileText,
    MapPin,
    Printer,
    User,
    Building2,
    Package,
    Banknote,
    Phone,
    Hash,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

function toPersianDigits(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(/\d/g, (digit) =>
        "۰۱۲۳۴۵۶۷۸۹"[digit]
    );
}

function formatAmount(value) {
    const number = Number(value) || 0;

    return toPersianDigits(
        number.toLocaleString("en-US")
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="invoice-preview-info-item">

            <div className="invoice-preview-info-icon">
                <Icon size={18} />
            </div>

            <div>

                <span className="invoice-preview-info-label">
                    {label}
                </span>

                <strong className="invoice-preview-info-value">
                    {value || "-"}
                </strong>

            </div>

        </div>
    );
}

export default function InvoicePreviewPage() {
    const params = useParams();
    const router = useRouter();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchInvoice() {
            try {
                setLoading(true);
                setError("");

                const id = params?.id;

                if (!id) {
                    throw new Error(
                        "شناسه فاکتور مشخص نیست."
                    );
                }

                const response = await fetch(
                    `/api/invoices/${id}`,
                    {
                        cache: "no-store",
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message ||
                        "خطا در دریافت فاکتور"
                    );
                }

                const invoiceData =
                    result.invoice ||
                    result;

                setInvoice(invoiceData);

            } catch (error) {
                console.error(
                    "Fetch invoice error:",
                    error
                );

                setError(
                    error.message ||
                    "خطا در دریافت فاکتور"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchInvoice();
    }, [params]);

    if (loading) {
        return (
            <main className="main-content">

                <div className="invoice-preview-empty">

                    <FileText size={48} />

                    <h2>
                        در حال دریافت فاکتور...
                    </h2>

                    <p>
                        اطلاعات فاکتور در حال دریافت است.
                    </p>

                </div>

            </main>
        );
    }

    if (error || !invoice) {
        return (
            <main className="main-content">

                <div className="invoice-preview-empty">

                    <FileText size={48} />

                    <h2>
                        فاکتور پیدا نشد
                    </h2>

                    <p>
                        {error || "اطلاعات این فاکتور در دسترس نیست."}
                    </p>

                    <button
                        type="button"
                        className="invoice-back-button"
                        onClick={() =>
                            router.push("/invoices")
                        }
                    >
                        <ArrowRight size={18} />

                        بازگشت به فاکتورها
                    </button>

                </div>

            </main>
        );
    }

    return (
        <main className="main-content">

            {/* هدر */}

            <div className="invoice-preview-heading">

                <div>

                    <button
                        type="button"
                        className="invoice-back-button"
                        onClick={() =>
                            router.push("/invoices")
                        }
                    >
                        <ArrowRight size={18} />

                        بازگشت به فاکتورها
                    </button>

                    <h1>
                        پیش‌نمایش فاکتور
                    </h1>

                    <p>
                        مشاهده کامل اطلاعات فاکتور و بار ثبت‌شده
                    </p>

                </div>

                <button
                    type="button"
                    className="invoice-preview-print-button"
                    onClick={() =>
                        window.print()
                    }
                >
                    <Printer size={19} />

                    چاپ فاکتور
                </button>

            </div>


            {/* خود فاکتور */}

            <section className="invoice-preview-card">

                {/* سربرگ فاکتور */}

                <div className="invoice-preview-top">

                    <div>

                        <div className="invoice-preview-logo">
                            T
                        </div>

                    </div>

                    <div className="invoice-preview-title">

                        <h2>
                            موسسه حمل و نقل کامران
                        </h2>

                        <span>
                            سیستم مدیریت حمل‌ونقل
                        </span>

                        <strong>
                            فاکتور حمل بار
                        </strong>

                    </div>

                    <div className="invoice-preview-number">

                        <span>
                            شماره فاکتور
                        </span>

                        <strong>
                            {toPersianDigits(
                                invoice.invoiceNumber ||
                                invoice.invoiceId ||
                                invoice._id
                            )}
                        </strong>

                    </div>

                </div>


                {/* اطلاعات پایه */}

                <div className="invoice-preview-section">

                    <div className="invoice-preview-section-title">

                        <FileText size={20} />

                        <h3>
                            اطلاعات فاکتور
                        </h3>

                    </div>

                    <div className="invoice-preview-info-grid">

                        <InfoItem
                            icon={Hash}
                            label="شماره فاکتور"
                            value={toPersianDigits(
                                invoice.invoiceNumber ||
                                invoice.invoiceId
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="تاریخ"
                            value={toPersianDigits(
                                invoice.date
                            )}
                        />

                        <InfoItem
                            icon={CalendarDays}
                            label="ساعت شروع"
                            value={invoice.startTime}
                        />

                        <InfoItem
                            icon={Building2}
                            label="شرکت"
                            value={
                                invoice.companyName ||
                                invoice.companyId?.name
                            }
                        />

                    </div>

                </div>


                {/* راننده */}

                <div className="invoice-preview-section">

                    <div className="invoice-preview-section-title">

                        <User size={20} />

                        <h3>
                            اطلاعات راننده
                        </h3>

                    </div>

                    <div className="invoice-preview-info-grid">

                        <InfoItem
                            icon={User}
                            label="نام راننده"
                            value={invoice.driverName}
                        />

                        <InfoItem
                            icon={Phone}
                            label="شماره تماس"
                            value={invoice.driverPhone}
                        />

                        <InfoItem
                            icon={Hash}
                            label="کد ملی"
                            value={toPersianDigits(
                                invoice.driverNationalId
                            )}
                        />

                        <InfoItem
                            icon={FileText}
                            label="شماره گواهینامه"
                            value={toPersianDigits(
                                invoice.driverLicenseNumber
                            )}
                        />

                    </div>

                </div>


                {/* خودرو */}

                <div className="invoice-preview-section">

                    <div className="invoice-preview-section-title">

                        <Car size={20} />

                        <h3>
                            اطلاعات خودرو
                        </h3>

                    </div>

                    <div className="invoice-preview-info-grid">

                        <InfoItem
                            icon={Car}
                            label="نوع خودرو"
                            value={invoice.vehicleType}
                        />

                        <InfoItem
                            icon={Hash}
                            label="شماره پلاک"
                            value={invoice.vehiclePlate}
                        />

                        <InfoItem
                            icon={Hash}
                            label="شناسه خودرو"
                            value={invoice.vehicleId}
                        />

                        <InfoItem
                            icon={User}
                            label="نوع راننده"
                            value={
                                invoice.driverType === "guest"
                                    ? "مهمان"
                                    : invoice.driverType === "main"
                                        ? "راننده اصلی"
                                        : "دستی"
                            }
                        />

                    </div>

                </div>


                {/* اطلاعات بار */}

                <div className="invoice-preview-section invoice-preview-load-section">

                    <div className="invoice-preview-section-title">

                        <Package size={20} />

                        <h3>
                            اطلاعات بار
                        </h3>

                    </div>

                    <div className="invoice-preview-info-grid">

                        <InfoItem
                            icon={Package}
                            label="نوع بار"
                            value={invoice.loadType}
                        />

                        <InfoItem
                            icon={Building2}
                            label="شرکت"
                            value={
                                invoice.companyName ||
                                invoice.companyId?.name
                            }
                        />

                        <InfoItem
                            icon={MapPin}
                            label="مبدا"
                            value={invoice.origin}
                        />

                        <InfoItem
                            icon={MapPin}
                            label="مقصد"
                            value={invoice.destination}
                        />

                        <InfoItem
                            icon={MapPin}
                            label="آدرس بار"
                            value={invoice.address}
                        />

                        <InfoItem
                            icon={MapPin}
                            label="مسافت"
                            value={
                                invoice.distance
                                    ? `${toPersianDigits(invoice.distance)} کیلومتر`
                                    : "-"
                            }
                        />

                    </div>

                </div>


                {/* هزینه ها */}

                <div className="invoice-preview-section">

                    <div className="invoice-preview-section-title">

                        <Banknote size={20} />

                        <h3>
                            اطلاعات مالی
                        </h3>

                    </div>

                    <div className="invoice-preview-cost-grid">

                        <div className="invoice-preview-cost-item">

                            <span>
                                هزینه حمل
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.cost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                نوع پرداخت
                            </span>

                            <strong>
                                {invoice.costType || "-"}
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                هزینه بیمه
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.insuranceCost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                هزینه کارگر
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.workerCost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                هزینه باسکول
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.scaleCost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                هزینه توقف
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.stopCost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                        <div className="invoice-preview-cost-item">

                            <span>
                                کمیسیون
                            </span>

                            <strong>
                                {formatAmount(
                                    invoice.commissionCost
                                )}

                                <small>
                                    {" "}تومان
                                </small>
                            </strong>

                        </div>

                    </div>

                    <div className="invoice-preview-total">

                        <span>
                            مبلغ کل حمل
                        </span>

                        <strong>
                            {formatAmount(
                                invoice.cost
                            )}

                            <small>
                                {" "}تومان
                            </small>
                        </strong>

                    </div>

                </div>


                {/* گیرنده */}

                <div className="invoice-preview-section">

                    <div className="invoice-preview-section-title">

                        <User size={20} />

                        <h3>
                            اطلاعات تکمیلی
                        </h3>

                    </div>

                    <div className="invoice-preview-info-grid">

                        <InfoItem
                            icon={User}
                            label="نام گیرنده"
                            value={invoice.receiverName}
                        />

                    </div>

                    {invoice.description && (
                        <div className="invoice-preview-description">

                            <span>
                                توضیحات
                            </span>

                            <p>
                                {invoice.description}
                            </p>

                        </div>
                    )}

                </div>


                {/* QR */}

                {invoice.qrCode && (
                    <div className="invoice-preview-qr-section">

                        <span>
                            QR Code
                        </span>

                        <div className="invoice-preview-qr">
                            {invoice.qrCode}
                        </div>

                    </div>
                )}


                {/* پایین فاکتور */}

                <div className="invoice-preview-footer">

                    <span>
                        این فاکتور توسط سیستم مدیریت حمل‌ونقل ثبت شده است.
                    </span>

                    <span>
                        {invoice.invoiceNumber}
                    </span>

                </div>

            </section>

        </main>
    );
}