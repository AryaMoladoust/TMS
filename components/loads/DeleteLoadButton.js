"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { useNotification } from "@/components/ui/NotificationProvider";

export default function DeleteLoadButton({ loadId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    confirm,
    showSuccess,
    showError,
  } = useNotification();


  // =====================================
  // حذف بار
  // =====================================

  const handleDelete = async () => {

    // -----------------------------------
    // تأیید حذف
    // -----------------------------------

    const confirmed = await confirm({
      title: "حذف بار",
      message:
        "آیا از حذف این بار مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
      confirmText: "حذف بار",
      cancelText: "انصراف",
      danger: true,
    });


    if (!confirmed) {
      return;
    }


    // -----------------------------------
    // شروع حذف
    // -----------------------------------

    setLoading(true);


    try {

      const response = await fetch(
        `/api/loads/${loadId}`,
        {
          method: "DELETE",
        }
      );


      const result =
        await response.json();


      // -----------------------------------
      // خطای API
      // -----------------------------------

      if (!response.ok) {

        showError(
          result.error ||
            result.message ||
            "خطا در حذف بار",
          "حذف بار ناموفق بود"
        );

        setLoading(false);

        return;
      }


      // -----------------------------------
      // موفقیت
      // -----------------------------------

      showSuccess(
        "بار با موفقیت حذف شد.",
        "حذف بار"
      );


      // -----------------------------------
      // بروزرسانی لیست بارها
      // -----------------------------------

      window.dispatchEvent(
        new Event("loads-data-updated")
      );


      // -----------------------------------
      // بازگشت به لیست
      // -----------------------------------

      setTimeout(() => {
        router.push("/loads");
        router.refresh();
      }, 700);


    } catch (error) {

      console.error(
        "Delete load error:",
        error
      );


      showError(
        "حذف بار انجام نشد. لطفاً دوباره تلاش کنید.",
        "خطا در حذف بار"
      );


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

      <span>
        {loading
          ? "در حال حذف..."
          : "حذف"}
      </span>

    </button>
  );
}