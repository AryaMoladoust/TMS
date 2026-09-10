import Link from "next/link";

import {
  Plus,
  Users,
  UserCheck,
} from "lucide-react";

import DriverSearch from "@/components/drivers/DriverSearch";
import DriverTable from "@/components/drivers/DriverTable";

export default function DriversPage() {
  return (
    <main className="main-content">

      {/* Page Header */}

      <div className="page-heading page-heading-with-action">

        <div>
          <h1>رانندگان</h1>

          <p>
            مدیریت، جستجو و مشاهده اطلاعات رانندگان
          </p>
        </div>

        <Link
          href="/drivers/add"
          className="primary-action-button"
        >
          <Plus size={19} />

          <span>
            افزودن راننده
          </span>
        </Link>

      </div>


      {/* Statistics */}

      <section className="driver-stats-grid">

        <div className="driver-stat-card">

          <div className="driver-stat-icon driver-stat-blue">
            <Users size={22} />
          </div>

          <div>
            <span>
              کل رانندگان
            </span>

            <strong>
              ۱۲۸
            </strong>
          </div>

        </div>


        <div className="driver-stat-card">

          <div className="driver-stat-icon driver-stat-green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>
              رانندگان آماده
            </span>

            <strong>
              ۳۴
            </strong>
          </div>

        </div>

      </section>


      {/* Search */}

      <DriverSearch />


      {/* Table */}

      <DriverTable />

    </main>
  );
}