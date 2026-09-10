import {
  FileText,
  ArrowLeft,
} from "lucide-react";

const invoices = [
  {
    id: "INV-1042",
    driver: "علی رضایی",
    company: "شرکت حمل‌ونقل شمال",
    date: "امروز",
    amount: "۱۸,۵۰۰,۰۰۰",
  },
  {
    id: "INV-1041",
    driver: "محمد کریمی",
    company: "شرکت بازرگانی گیلان",
    date: "امروز",
    amount: "۲۲,۰۰۰,۰۰۰",
  },
  {
    id: "INV-1040",
    driver: "رضا احمدی",
    company: "صنایع شمال",
    date: "دیروز",
    amount: "۱۵,۸۰۰,۰۰۰",
  },
];

export default function InvoiceSummary() {
  return (
    <section className="panel invoice-panel">
      <div className="panel-header">
        <div>
          <h2>آخرین فاکتورها</h2>
          <p>آخرین بارنامه‌های ثبت شده</p>
        </div>

        <a href="/invoices">مشاهده همه</a>
      </div>

      <div className="invoice-table">
        <div className="invoice-header-row">
          <span>شماره</span>
          <span>راننده</span>
          <span>شرکت</span>
          <span>تاریخ</span>
          <span>مبلغ</span>
          <span></span>
        </div>

        {invoices.map((invoice) => (
          <div className="invoice-row" key={invoice.id}>
            <div className="invoice-number">
              <div className="invoice-icon">
                <FileText size={17} />
              </div>

              <strong>{invoice.id}</strong>
            </div>

            <span>{invoice.driver}</span>
            <span>{invoice.company}</span>
            <span>{invoice.date}</span>

            <strong>{invoice.amount} تومان</strong>

            <a href={`/invoices/${invoice.id}`}>
              <ArrowLeft size={17} />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}