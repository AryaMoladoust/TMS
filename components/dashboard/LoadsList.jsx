import {
  MapPin,
  Package,
  ArrowLeft,
} from "lucide-react";

const loads = [
  {
    id: "B-1028",
    type: "مواد غذایی",
    origin: "رشت",
    destination: "تهران",
    status: "undelivered",
  },
  {
    id: "B-1027",
    type: "قطعات صنعتی",
    origin: "قزوین",
    destination: "تبریز",
    status: "undelivered",
  },
  {
    id: "B-1025",
    type: "مصالح ساختمانی",
    origin: "رشت",
    destination: "کرج",
    status: "delivered",
  },
  {
    id: "B-1021",
    type: "محصولات کشاورزی",
    origin: "لاهیجان",
    destination: "تهران",
    status: "delivered",
  },
];

export default function LoadsList() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>آخرین بارها</h2>
          <p>وضعیت بارهای ثبت شده</p>
        </div>

        <a href="/loads">مشاهده همه</a>
      </div>

      <div className="loads-list">
        {loads.map((load) => (
          <div className="load-row" key={load.id}>
            <div className="load-icon">
              <Package size={20} />
            </div>

            <div className="load-info">
              <strong>
                {load.id} — {load.type}
              </strong>

              <div className="route">
                <MapPin size={14} />
                <span>{load.origin}</span>

                <ArrowLeft size={14} />

                <span>{load.destination}</span>
              </div>
            </div>

            <span
              className={`load-status ${
                load.status === "undelivered"
                  ? "status-undelivered"
                  : "status-delivered"
              }`}
            >
              {load.status === "undelivered"
                ? "تحویل نشده"
                : "تحویل شده"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}