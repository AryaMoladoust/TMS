"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteLoadButton({ loadId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "آیا از حذف این بار مطمئن هستید؟ این عملیات قابل بازگشت نیست."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/loads/${loadId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || result.message || "خطا در حذف بار");
        setLoading(false);
        return;
      }

      alert("بار با موفقیت حذف شد.");

      router.push("/loads");
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("حذف بار انجام نشد.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="danger-action-button"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 size={18} />
      <span>{loading ? "در حال حذف..." : "حذف"}</span>
    </button>
  );
}