"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Users,
  UserCheck,
} from "lucide-react";

import DriverSearch from "@/components/drivers/DriverSearch";
import DriverTable from "@/components/drivers/DriverTable";

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    vehicleType: "",
    licenseStatus: "",
  });

  useEffect(() => {
    async function loadDrivers() {
      try {
        const response = await fetch("/api/drivers");

        const data = await response.json();

        if (response.ok) {
          setDrivers(data.drivers || []);
        }
      } catch (error) {
        console.error(
          "خطا در دریافت رانندگان:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDrivers();
  }, []);

  const availableDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      if (!driver.licenseExpiry) {
        return true;
      }

      return true;
    });
  }, [drivers]);

  return (
    <main className="main-content">
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
          <span>افزودن راننده</span>
        </Link>
      </div>

      <section className="driver-stats-grid">
        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-blue">
            <Users size={22} />
          </div>

          <div>
            <span>کل رانندگان</span>

            <strong>
              {drivers.length}
            </strong>
          </div>
        </div>

        <div className="driver-stat-card">
          <div className="driver-stat-icon driver-stat-green">
            <UserCheck size={22} />
          </div>

          <div>
            <span>رانندگان معتبر</span>

            <strong>
              {availableDrivers.length}
            </strong>
          </div>
        </div>
      </section>

      <DriverSearch
        filters={filters}
        setFilters={setFilters}
      />

      {loading ? (
        <div className="driver-loading">
          در حال دریافت لیست رانندگان...
        </div>
      ) : (
        <DriverTable
          drivers={drivers}
          filters={filters}
        />
      )}
    </main>
  );
}