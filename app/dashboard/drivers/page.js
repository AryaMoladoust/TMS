import Link from "next/link";
import { Plus, Users, UserCheck, Truck, UserX } from "lucide-react";
import DriverSearch from "@/components/drivers/DriverSearch";
import DriverTable from "@/components/drivers/DriverTable";

export default function DriversPage() {
  return (
    <main className="main-content">

      <div className="page-heading page-heading-with-action">
        <div>
          <h1>رانندگان</h1>
          <p>مدیریت، جستجو و مشاهده اطلاعات رانندگان</p>
        </div>

        <Link href="/drivers/add" className="primary-action-button">
          <Plus size={19} />
          افزودن راننده
        </Link>
      </div>

      <section className="driver-stats-grid">

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-blue">
            <Users size={22} />
          </div>

          <div>
            <span>کل رانندگان</span>
            <strong>۱۲۸</strong>
          </div>
        </div>

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>آماده به کار</span>
            <strong>۳۴</strong>
          </div>
        </div>

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-orange">
            <Truck size={22} />
          </div>

          <div>
            <span>در حال حمل بار</span>
            <strong>۲۷</strong>
          </div>
        </div>

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-gray">
            <UserX size={22} />
          </div>

          <div>
            <span>غیرفعال</span>
            <strong>۶۷</strong>
          </div>
        </div>

      </section>

      <DriverSearch />

      <DriverTable />

    </main>
  );
}