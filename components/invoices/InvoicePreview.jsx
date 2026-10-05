"use client";

import { Printer, Download, X, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

import { useNotification } from "@/components/ui/NotificationProvider";

const cargoTypeLabels = {
  food: "مواد غذایی",
  industrial: "قطعات صنعتی",
  construction: "مصالح ساختمانی",
  agriculture: "محصولات کشاورزی",
  other: "سایر",

  "مواد غذایی": "مواد غذایی",
  "قطعات صنعتی": "قطعات صنعتی",
  "مصالح ساختمانی": "مصالح ساختمانی",
  "محصولات کشاورزی": "محصولات کشاورزی",
  سایر: "سایر",
};

function getCargoTypeLabel(value) {
  return cargoTypeLabels[value] || value || "—";
}

const paymentTypeLabels = {
  credit: "اعتباری",
  cash: "نقد",
  اعتباری: "اعتباری",
  نقد: "نقد",
};

/* =========================================================
   اطلاعات ثابت باربری صادرکننده فاکتور
========================================================= */

const transportCompany = {
  name: "موسسه حمل و نقل کامران",
  manager: "کامران صمدیان",
  mobile: "09111328288",
  phone: "33883484 - 33882084",
};

function getPaymentTypeLabel(value) {
  return paymentTypeLabels[value] || value || "—";
}

function getPaymentTypeClass(value) {
  if (value === "cash" || value === "نقد") {
    return "cash";
  }

  if (value === "credit" || value === "اعتباری") {
    return "credit";
  }

  return "unknown";
}

export default function InvoicePreview({ invoice, onClose }) {
  const {
    confirm,
    showSuccess,
    showError,
  } = useNotification();

  if (!invoice) return null;

  // =========================================================
  // لینک مسیریابی
  // =========================================================

  const hasDestinationCoords =
    invoice.destinationLat !== undefined &&
    invoice.destinationLat !== null &&
    invoice.destinationLat !== "" &&
    invoice.destinationLng !== undefined &&
    invoice.destinationLng !== null &&
    invoice.destinationLng !== "";

  const mapLink = hasDestinationCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${invoice.destinationLat},${invoice.destinationLng}&travelmode=driving`
    : invoice.destination && invoice.destination !== "—"
      ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        invoice.destination
      )}&travelmode=driving`
      : "";

  // =========================================================
  // چاپ
  // =========================================================

  const printInvoice = () => {
    window.print();
  };

  // =========================================================
  // حذف فاکتور
  // =========================================================

  const deleteInvoice = async () => {
    if (!invoice?._id) {
      showError(
        "شناسه فاکتور پیدا نشد.",
        "خطا"
      );

      return;
    }

    const confirmed = await confirm({
      title: "حذف فاکتور",
      message:
        "آیا از حذف این فاکتور مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
      confirmText: "حذف فاکتور",
      cancelText: "انصراف",
      danger: true,
    });

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/invoices?id=${encodeURIComponent(invoice._id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "حذف فاکتور انجام نشد."
        );
      }

      showSuccess(
        "فاکتور با موفقیت حذف شد.",
        "حذف فاکتور"
      );

      onClose();

      window.location.reload();
    } catch (error) {
      console.error(
        "Delete invoice error:",
        error
      );

      showError(
        error.message ||
        "خطا در حذف فاکتور",
        "خطا در حذف"
      );
    }
  };

  // =========================================================
  // دانلود PDF
  // =========================================================

  const downloadPDF = async () => {
    const element =
      document.getElementById("invoice-a5");

    if (!element) {
      showError(
        "محتوای فاکتور برای ساخت PDF پیدا نشد.",
        "خطا در ایجاد PDF"
      );

      return;
    }

    try {
      // -------------------------------------------------------
      // صبر برای لود کامل فونت‌ها
      // -------------------------------------------------------

      if (
        document.fonts &&
        document.fonts.ready
      ) {
        await document.fonts.ready;
      }

      // -------------------------------------------------------
      // فرصت برای کامل شدن رندر
      // -------------------------------------------------------

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      // -------------------------------------------------------
      // تبدیل فاکتور به Canvas
      // -------------------------------------------------------

      const canvas = await html2canvas(
        element,
        {
          scale: 3,

          useCORS: true,

          backgroundColor: "#ffffff",

          letterRendering: true,

          onclone: (clonedDoc) => {
            // ---------------------------------------------------
            // تنظیم واترمارک
            // ---------------------------------------------------

            const watermark =
              clonedDoc.querySelector(
                ".invoice-watermark"
              );

            if (watermark) {
              watermark.style.fontFamily =
                "Vazirmatn, Arial, sans-serif";

              watermark.style.direction =
                "rtl";

              watermark.style.unicodeBidi =
                "bidi-override";
            }

            // ---------------------------------------------------
            // اصلاح پرانتزهای فارسی برای PDF
            // ---------------------------------------------------

            const parenFixElements =
              clonedDoc.querySelectorAll(
                ".invoice-paren-fix"
              );

            parenFixElements.forEach(
              (element) => {
                element.textContent =
                  element.textContent
                    .replace(/\(/g, "\u0001")
                    .replace(/\)/g, "(")
                    .replace(
                      /\u0001/g,
                      ")"
                    );
              }
            );
          },
        }
      );

      // -------------------------------------------------------
      // تبدیل Canvas به تصویر
      // -------------------------------------------------------

      const imgData =
        canvas.toDataURL("image/png");

      // -------------------------------------------------------
      // ساخت PDF با اندازه A5
      // -------------------------------------------------------

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5",
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        148,
        210
      );

      // -------------------------------------------------------
      // ذخیره فایل
      // -------------------------------------------------------

      pdf.save(
        `بارنامه-${invoice.number}.pdf`
      );

      // -------------------------------------------------------
      // پیام موفقیت
      // -------------------------------------------------------

      showSuccess(
        "فایل PDF فاکتور با موفقیت ایجاد شد.",
        "دانلود PDF"
      );
    } catch (error) {
      console.error(
        "PDF Error:",
        error
      );

      showError(
        "خطا در ساخت فایل PDF.",
        "خطا در ایجاد PDF"
      );
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="invoice-preview-overlay">
      {/* Preview Wrapper */}

      <div className="invoice-preview-wrapper">

        {/* Toolbar */}

        <div className="invoice-preview-toolbar">

          {/* Brand */}

          <div className="invoice-preview-brand">

            <div className="invoice-preview-logo">
              <img
                src="/icons/icon-192.png"
                alt="TMS"
              />
            </div>

            <div className="invoice-preview-brand-text">
              <strong>
                پیش‌نمایش فاکتور
              </strong>

              <span>
                فاکتور حمل بار
              </span>
            </div>

          </div>

          {/* Buttons */}

          <div className="invoice-preview-buttons">

            {/* Print */}

            <button
              type="button"
              className="invoice-print-btn"
              onClick={printInvoice}
            >
              <Printer size={18} />

              <span>
                چاپ
              </span>
            </button>

            {/* Download PDF */}

            <button
              type="button"
              className="invoice-download-btn"
              onClick={downloadPDF}
            >
              <Download size={18} />

              <span>
                دانلود PDF
              </span>
            </button>

            {/* Delete */}

            <button
              type="button"
              className="invoice-delete-btn"
              onClick={deleteInvoice}
            >
              <Trash2 size={18} />

              <span>
                حذف فاکتور
              </span>
            </button>

            {/* Close */}

            <button
              type="button"
              className="invoice-close-btn"
              onClick={onClose}
              aria-label="بستن"
            >
              <X size={20} />
            </button>

          </div>
        </div>

        {/* Invoice Scroll */}

        <div className="invoice-preview-scroll">

          {/* A5 Invoice */}

          <div
            id="invoice-a5"
            className="invoice-a5"
          >

            {/* بسمه تعالی */}

            <div className="invoice-besmi">
              بسمه تعالی
            </div>

            {/* Watermark */}

            <div className="invoice-watermark">
              کامران
            </div>

            {/* Invoice Header */}

            <div className="invoice-header-modern">

              <div className="invoice-company">
                <div className="invoice-logo">
                  <img
                    src="/icons/icon-192.png"
                    alt="TMS"
                  />
                </div>

                <div>
                  <h3>
                    {transportCompany.name}
                  </h3>

                  <p>
                    مدیر مسئول:{" "}
                    {transportCompany.manager}
                  </p>

                  <p className="invoice-company-phone">
                    همراه:{" "}
                    {transportCompany.mobile}
                  </p>

                  <p className="invoice-company-phone">
                    ثابت:{" "}
                    {transportCompany.phone}
                  </p>
                </div>
              </div>

              <div className="invoice-title-side">

                <h1>
                  فاکتور و رسید کالا
                </h1>

                <div className="invoice-meta-line">

                  <span>
                    <strong>
                      تاریخ:
                    </strong>{" "}
                    {invoice.date}
                  </span>

                  <span>
                    <strong>
                      ساعت:
                    </strong>{" "}
                    {invoice.startTime}
                  </span>

                </div>

              </div>

            </div>

            {/* Invoice Information */}

            <div className="invoice-info-grid">

              {/* Company */}

              <div className="invoice-info-card">

                <h3 className="invoice-paren-fix">
                  اطلاعات شرکت (فرستنده)
                </h3>

                <p>
                  <strong>
                    نام:
                  </strong>{" "}
                  {invoice.clientCompanyName ||
                    "—"}
                </p>

                <p>
                  <strong>
                    نوع بار:
                  </strong>{" "}
                  {getCargoTypeLabel(
                    invoice.cargoType
                  )}
                </p>

              </div>

              {/* Driver */}

              <div className="invoice-info-card">

                <h3>
                  اطلاعات راننده
                </h3>

                <p>
                  <strong>
                    نام:
                  </strong>{" "}
                  {invoice.driver}
                </p>

                <p>
                  <strong>
                    خودرو:
                  </strong>{" "}
                  {invoice.vehicle}
                </p>

                <p>
                  <strong>
                    پلاک:
                  </strong>{" "}
                  {invoice.plate || "—"}
                </p>

              </div>

              {/* Load */}

              <div className="invoice-info-card">

                <h3>
                  اطلاعات بار
                </h3>

                <p>
                  <strong>
                    مبدأ:
                  </strong>{" "}
                  {invoice.origin}
                </p>

                <p>
                  <strong>
                    مقصد:
                  </strong>{" "}
                  {invoice.destination}
                </p>

                <p>
                  <strong>
                    مسافت:
                  </strong>{" "}
                  {invoice.distance}
                </p>

              </div>

            </div>

            {/* ========================= */}
            {/* Cost Table */}
            {/* ========================= */}

            <div className="invoice-cost-wrapper">

              <div className="invoice-table-title">

                <span className="invoice-table-title-text">
                  جزئیات هزینه‌ها
                </span>

                <div
                  className={`invoice-payment-status ${getPaymentTypeClass(
                    invoice.paymentType
                  )}`}
                >

                  <span className="invoice-payment-status-label">
                    وضعیت پرداخت
                  </span>

                  <span className="invoice-payment-status-value">
                    {getPaymentTypeLabel(
                      invoice.paymentType
                    )}
                  </span>

                </div>

              </div>

              <table className="invoice-cost-table">

                <thead>

                  <tr>

                    <th>
                      ردیف
                    </th>

                    <th>
                      شرح هزینه
                    </th>

                    <th className="invoice-amount-header invoice-paren-fix">
                      مبلغ (تومان)
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr>
                    <td>
                      ۱
                    </td>

                    <td>
                      کرایه حمل بار
                    </td>

                    <td>
                      {invoice.cost}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      ۲
                    </td>

                    <td>
                      بیمه بار
                    </td>

                    <td>
                      {invoice.insurance}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      ۳
                    </td>

                    <td>
                      هزینه کارگر
                    </td>

                    <td>
                      {invoice.workerCost ||
                        "۰"}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      ۴
                    </td>

                    <td>
                      هزینه باسکول
                    </td>

                    <td>
                      {invoice.scaleCost ||
                        "۰"}
                    </td>
                  </tr>

                  <tr>
                    <td>
                      ۵
                    </td>

                    <td>
                      هزینه توقف
                    </td>

                    <td>
                      {invoice.stopCost ||
                        "۰"}
                    </td>
                  </tr>

                </tbody>

                <tfoot>

                  <tr className="invoice-total-row">

                    <td
                      colSpan={2}
                      className="invoice-total-label"
                    >
                      مبلغ کل با احتساب مالیات و کمیسیون
                    </td>

                    <td className="invoice-total-value">
                      {invoice.total} تومان
                    </td>

                  </tr>

                </tfoot>

              </table>

              <div className="invoice-amount-words">

                <strong>
                  مبلغ به حروف:
                </strong>{" "}

                {invoice.totalInWords}

              </div>

            </div>

            {/* ========================= */}
            {/* Route / QR */}
            {/* ========================= */}

            <div className="invoice-route-box">

              <div className="invoice-route-info">

                <h3>
                  مسیر راننده
                </h3>

                <p className="invoice-route-destination">

                  <strong>
                    گیرنده:
                  </strong>{" "}

                  {invoice.receiverName ||
                    "—"}

                </p>

                <p className="invoice-route-address-line">
                  {invoice.loadAddress ||
                    "—"}
                </p>

              </div>

              <div className="invoice-route-qr">

                {mapLink ? (
                  <QRCode
                    value={mapLink}
                    size={64}
                    bgColor="#ffffff"
                    fgColor="#111827"
                  />
                ) : (
                  <div className="qr-placeholder">
                    QR
                  </div>
                )}

              </div>

            </div>

            {/* ========================= */}
            {/* Signatures */}
            {/* ========================= */}

            <div className="invoice-sign-area">

              {/* امضای راننده */}

              <div className="invoice-sign-card">

                <div className="invoice-sign-text">
                  امضای راننده
                </div>

              </div>

              {/* مهر و امضای مسئول باربری */}

              <div className="invoice-sign-card">

                <div className="invoice-sign-text">
                  مهر و امضای مسئول باربری
                </div>

              </div>

            </div>

            {/* ========================= */}
            {/* Liability Notice */}
            {/* ========================= */}

            <div className="invoice-legal-notice">

              <div className="invoice-legal-notice-title">
                ملاحظات مهم
              </div>

              <p className="invoice-legal-notice-item">

                <strong>
                  ۱.
                </strong>{" "}

                شکستگی، روندگی، ضربه‌دیدگی و بیمه کالا از
                مبدأ تا مقصد، و رعایت حریم حمل بار
                (طول بار، ارتفاع بار) بر عهده صاحب کالا
                می‌باشد.

              </p>

              <p className="invoice-legal-notice-item">

                <strong>
                  ۲.
                </strong>{" "}

                ارزش بار به اظهار فرستنده، ۴ میلیارد ریال
                است؛ چنانچه ارزش واقعی کالا بیشتر از این
                مبلغ باشد، این موسسه و راننده در قبال
                حادثه احتمالی و جبران خسارت بیمه بار
                مسئولیتی نخواهند داشت.

              </p>

              <p className="invoice-legal-notice-item">

                <strong>
                  ۳.
                </strong>{" "}

                خسارت ناشی از شورش، جنگ و اعتصاب جزو
                تعهدات موسسه حمل و نقل کامران، بیمه بار
                و راننده نمی‌باشد و مسئولیت آن بر عهده
                فرستنده کالا است.

              </p>

            </div>

            {/* ========================= */}
            {/* Freight Address + Notes */}
            {/* ========================= */}

            <div className="invoice-footer-row">

              <div className="invoice-freight-address">

                <div className="invoice-freight-address-icon">
                  📍
                </div>

                <div className="invoice-freight-address-content">

                  <h3>
                    آدرس باربری:
                  </h3>

                  <p>
                    رشت، شهرک صنعتی، جنب هنرستان اشی مشی
                  </p>

                </div>

              </div>

              <div className="invoice-note-box">

                <h3>
                  توضیحات
                </h3>

                <p>
                  {invoice.description ||
                    "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}