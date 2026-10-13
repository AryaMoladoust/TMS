"use client";

import LoadSearch from "@/components/loads/LoadSearch";
import LoadTable from "@/components/loads/LoadTable";

export default function LoadsBoard({
  loads = [],
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange = () => {},
  searchTerm = "",
  onSearchChange = () => {},
  typeFilter = "",
  onTypeChange = () => {},
  vehicleFilter = "",
  onVehicleChange = () => {},
  onReset = () => {},
}) {
  const isFiltering =
    Boolean(searchTerm.trim()) ||
    Boolean(typeFilter) ||
    Boolean(vehicleFilter);

  return (
    <>
      <LoadSearch
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        typeFilter={typeFilter}
        onTypeChange={onTypeChange}
        vehicleFilter={vehicleFilter}
        onVehicleChange={onVehicleChange}
        onReset={onReset}
      />

      <LoadTable
        loads={loads}
        pagination={pagination}
        onPageChange={onPageChange}
        emptyTitle={
          isFiltering
            ? "هیچ باری با این فیلترها پیدا نشد"
            : "هنوز هیچ باری ثبت نشده است"
        }
        emptySubtitle={
          isFiltering
            ? "فیلترها را تغییر دهید یا پاک کنید."
            : "برای شروع، یک بار جدید ثبت کنید."
        }
      />
    </>
  );
}
