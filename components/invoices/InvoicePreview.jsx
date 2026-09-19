"use client";

import { Printer, Download, X } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "react-qr-code";

export default function InvoicePreview({ invoice, onClose }) {
  if (!invoice) return null;
  const mapLink =
    invoice.destination && invoice.destination !== "—"
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        invoice.destination
      )}`
      : "";
  const printInvoice = () => {
    window.print();
  };

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-a5");

    if (!element) return;

    try {
      // صبر می‌کنیم تمام فونت‌های فارسی کاملاً لود شوند
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // یک فرصت برای کامل شدن رندر مرورگر
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",

        // مهم برای فارسی
        letterRendering: true,

        onclone: (clonedDoc) => {
          const watermark = clonedDoc.querySelector(".invoice-watermark");

          if (watermark) {
            watermark.style.fontFamily = "Vazirmatn, Arial, sans-serif";
            watermark.style.direction = "rtl";
            watermark.style.unicodeBidi = "bidi-override";
          }
        },
      });

      const imgData = canvas.toDataURL("image/png");

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

      pdf.save(`بارنامه-${invoice.number}.pdf`);

    } catch (error) {
      console.error("PDF Error:", error);
      alert("خطا در ساخت فایل PDF");
    }
  };

  return (
    <div className="invoice-preview-overlay">

      {/* Preview Wrapper */}
      <div className="invoice-preview-wrapper">

        {/* Toolbar */}
        <div className="invoice-preview-toolbar">

          {/* Brand */}
          <div className="invoice-preview-brand">
            <div className="invoice-preview-logo">
              TMS
            </div>

            <div className="invoice-preview-brand-text">
              <strong>پیش‌نمایش فاکتور</strong>
              <span>فاکتور حمل بار</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="invoice-preview-buttons">

            <button
              type="button"
              className="invoice-print-btn"
              onClick={printInvoice}
            >
              <Printer size={18} />
              <span>چاپ</span>
            </button>

            <button
              type="button"
              className="invoice-download-btn"
              onClick={downloadPDF}
            >
              <Download size={18} />
              <span>دانلود PDF</span>
            </button>

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

            {/* بسمی تعالی - ابتدای برگه */}

            <div className="invoice-besmi">
              بسمی تعالی
            </div>
            {/* Watermark */}

            <div className="invoice-watermark">
              کامران
            </div>

            {/* Invoice Header */}

            <div className="invoice-header-modern">

              <div className="invoice-company">

                <div className="invoice-logo">
                  TMS
                </div>

                <div>
                  <h3>{invoice.companyName}</h3>
                  <p>مسئول فاکتور: {invoice.companyManager}</p>
                </div>

              </div>

              <div className="invoice-title-side">

                <h1>فاکتور و رسید کالا</h1>

                <div className="invoice-meta-row">
                  <span>شماره:</span>
                  <strong>{invoice.number}</strong>
                </div>

                <div className="invoice-meta-row">
                  <span>تاریخ:</span>
                  <strong>{invoice.date}</strong>
                </div>

                <div className="invoice-meta-row">
                  <span>ساعت:</span>
                  <strong>{invoice.startTime}</strong>
                </div>

              </div>

            </div>

            <div className="invoice-info-grid">

              <div className="invoice-info-card">
                <h3>اطلاعات شرکت</h3>
                <p><strong>نام:</strong> {invoice.clientCompanyName || "—"}</p>
                <p><strong>نوع بار:</strong> {invoice.cargoType || "—"}</p>
                <p><strong>عنوان بار:</strong> {invoice.cargoTitle || "—"}</p>
              </div>

              <div className="invoice-info-card">
                <h3>اطلاعات راننده</h3>

                <p>
                  <strong>نام:</strong> {invoice.driver}
                </p>

                <p>
                  <strong>خودرو:</strong> {invoice.vehicle}
                </p>

                <p>
                  <strong>پلاک:</strong> {invoice.plate || "—"}
                </p>
              </div>

              <div className="invoice-info-card">
                <h3>اطلاعات بار</h3>
                <p><strong>مبدأ:</strong> {invoice.origin}</p>
                <p><strong>مقصد:</strong> {invoice.destination}</p>
                <p><strong>مسافت:</strong> {invoice.distance}</p>
                <p><strong>آدرس بار:</strong> {invoice.loadAddress || "—"}</p>
              </div>

            </div>

            {/* ========================= */}
            {/* Cost Table */}
            {/* ========================= */}

            <div className="invoice-cost-wrapper">

              <div className="invoice-table-title">
                جزئیات هزینه‌ها
              </div>

              <table className="invoice-cost-table">

                <thead>
                  <tr>
                    <th>ردیف</th>
                    <th>شرح هزینه</th>
                    <th>مبلغ (تومان)</th>
                    <th>توضیحات</th>
                  </tr>
                </thead>

                <tbody>

                  <tr>
                    <td>۱</td>
                    <td>کرایه حمل بار</td>
                    <td>{invoice.cost}</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>۲</td>
                    <td>بیمه بار</td>
                    <td>{invoice.insurance}</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>۳</td>
                    <td>هزینه کارگر</td>
                    <td>{invoice.workerCost || "۰"}</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>۴</td>
                    <td>هزینه باسکول</td>
                    <td>{invoice.scaleCost || "۰"}</td>
                    <td>—</td>
                  </tr>

                  <tr>
                    <td>۵</td>
                    <td>هزینه توقف</td>
                    <td>{invoice.stopCost || "۰"}</td>
                    <td>—</td>
                  </tr>

                </tbody>

                <tfoot>

                  <tr className="invoice-total-row">
                    <td colSpan={2}>جمع کل</td>
                    <td colSpan={2}>{invoice.total} تومان</td>
                  </tr>

                </tfoot>

              </table>

            </div>

            {/* ========================= */}
            {/* Route / QR */}
            {/* ========================= */}

            <div className="invoice-route-box">

              <div className="invoice-route-info">

                <h3>مسیر راننده</h3>

                <p className="invoice-route-destination">
                  <strong>مقصد:</strong> {invoice.destination}
                </p>

                <p className="invoice-route-address-line">
                  {invoice.loadAddress || "—"}
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

                <div className="invoice-sign-line"></div>

                <div className="invoice-sign-text">
                  امضای راننده
                </div>

              </div>

              {/* مهر و امضای مسئول باربری */}
              <div className="invoice-sign-card">

                <div className="invoice-sign-line"></div>

                <div className="invoice-sign-text">
                  مهر و امضای مسئول باربری
                </div>

              </div>

            </div>

            {/* ========================= */}
            {/* Freight address + Notes side by side */}
            {/* ========================= */}

            <div className="invoice-footer-row">

              <div className="invoice-freight-address">

                <div className="invoice-freight-address-icon">
                  📍
                </div>

                <div className="invoice-freight-address-content">
                  <h3>آدرس باربری:</h3>
                  <p>رشت، شهرک صنعتی، جنب هنرستان اشی مشی </p>
                </div>

              </div>

              <div className="invoice-note-box">

                <h3>توضیحات</h3>

                <p>
                  {invoice.description || "—"}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}