import {
  UserRound,
  Phone,
  CheckCircle2,
} from "lucide-react";

const drivers = [
  {
    name: "علی رضایی",
    phone: "0912 123 4567",
    vehicle: "کامیون",
    plate: "۱۲۳ الف ۴۵",
  },
  {
    name: "محمد کریمی",
    phone: "0911 456 7890",
    vehicle: "تریلی",
    plate: "۵۶۷ ب ۲۳",
  },
  {
    name: "رضا احمدی",
    phone: "0912 789 1234",
    vehicle: "کامیون",
    plate: "۸۹۰ ج ۱۱",
  },
];

export default function AvailableDrivers() {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>رانندگان آماده</h2>
          <p>رانندگان امروز بدون بار</p>
        </div>

        <a href="/drivers">مشاهده همه</a>
      </div>

      <div className="driver-list">
        {drivers.map((driver) => (
          <div className="driver-row" key={driver.name}>
            <div className="driver-avatar">
              <UserRound size={20} />
            </div>

            <div className="driver-main">
              <strong>{driver.name}</strong>
              <span>
                {driver.vehicle} • {driver.plate}
              </span>
            </div>

            <div className="driver-contact">
              <Phone size={15} />
              <span>{driver.phone}</span>
            </div>

            <div className="available-badge">
              <CheckCircle2 size={14} />
              آماده
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}