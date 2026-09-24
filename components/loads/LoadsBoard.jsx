"use client";

import { useMemo, useState } from "react";

import LoadSearch from "@/components/loads/LoadSearch";
import LoadTable from "@/components/loads/LoadTable";

export default function LoadsBoard({ loads = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");

  const filteredLoads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return loads.filter((load) => {
      if (normalizedSearch) {
        const haystack = [
          load.title,
          load.companyName,
          load.origin,
          load.destination,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedSearch)) {
          return false;
        }
      }

      if (
        statusFilter === "delivered" &&
        load.status !== "delivered"
      ) {
        return false;
      }

      if (
        statusFilter === "undelivered" &&
        load.status === "delivered"
      ) {
        return false;
      }

      if (typeFilter && load.barType !== typeFilter) {
        return false;
      }

      if (vehicleFilter && load.vehicleType !== vehicleFilter) {
        return false;
      }

      return true;
    });
  }, [loads, searchTerm, statusFilter, typeFilter, vehicleFilter]);

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setVehicleFilter("");
  }

  const isFiltering =
    Boolean(searchTerm.trim()) ||
    Boolean(statusFilter) ||
    Boolean(typeFilter) ||
    Boolean(vehicleFilter);

  return (
    <>
      <LoadSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        vehicleFilter={vehicleFilter}
        onVehicleChange={setVehicleFilter}
        onReset={resetFilters}
      />

      <LoadTable
        loads={filteredLoads}
        emptyTitle={
          isFiltering && loads.length > 0
            ? "هیچ باری با این فیلترها پیدا نشد"
            : "هنوز هیچ باری ثبت نشده است"
        }
        emptySubtitle={
          isFiltering && loads.length > 0
            ? "فیلترها را تغییر دهید یا پاک کنید."
            : "برای شروع، یک بار جدید ثبت کنید."
        }
      />
    </>
  );
}
