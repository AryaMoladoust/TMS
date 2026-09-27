"use client";

import {
  Menu,
  Sun,
  Moon,
  CalendarDays,
  Wifi,
  PanelRightOpen,
  User,
  LogOut,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const persianWeekdays = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];

const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

function gregorianToJalali(gy, gm, gd) {
  const gdm = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334,
  ];

  let jy;

  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }

  const gy2 = gm > 2 ? gy + 1 : gy;

  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    gdm[gm - 1];

  jy += 33 * Math.floor(days / 12053);

  days %= 12053;

  jy += 4 * Math.floor(days / 1461);

  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  let jm;

  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
  }

  const jd =
    1 +
    (days < 186
      ? days % 31
      : (days - 186) % 30);

  return [jy, jm, jd];
}

function toPersianNumber(number) {
  return String(number).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}

function getLiveDate() {
  const now = new Date();

  const [jy, jm, jd] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  const weekday =
    persianWeekdays[now.getDay()];

  const time = now.toLocaleTimeString(
    "fa-IR",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }
  );

  return {
    date: `${weekday}، ${toPersianNumber(
      jd
    )} ${persianMonths[jm - 1]} ${toPersianNumber(
      jy
    )}`,
    time,
  };
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}) {
  const router = useRouter();

  const [darkMode, setDarkMode] =
    useState(false);

  const [liveDate, setLiveDate] = useState({
    date: "",
    time: "",
  });

  const [currentUser, setCurrentUser] =
    useState(null);

  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("tms-theme");

    if (savedTheme === "dark") {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );
    }

    setLiveDate(getLiveDate());

    const timer = setInterval(() => {
      setLiveDate(getLiveDate());
    }, 1000);

    loadCurrentUser();

    return () => clearInterval(timer);
  }, []);

  async function loadCurrentUser() {
    try {
      const response = await fetch(
        "/api/auth/me",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setCurrentUser(null);
        return;
      }

      const data = await response.json();

      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error(
        "خطا در دریافت کاربر:",
        error
      );

      setCurrentUser(null);
    }
  }

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(
          "خروج از حساب انجام نشد."
        );
      }

      router.replace("/auth/login");

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "خطا در خروج از حساب"
      );

      setLoggingOut(false);
    }
  }

  function toggleTheme() {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    if (nextMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "tms-theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "tms-theme",
        "light"
      );
    }
  }

  function openMobileMenu() {
    window.dispatchEvent(
      new CustomEvent("open-mobile-menu")
    );
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  return (
    <header className="header">

      {/* سمت راست هدر */}

      <div className="header-right">

        <button
          className="mobile-menu-button"
          onClick={openMobileMenu}
          aria-label="باز کردن منو"
        >
          <Menu size={23} />
        </button>

        {!sidebarOpen && (
          <button
            className="desktop-sidebar-open-button"
            onClick={openSidebar}
            aria-label="باز کردن منوی کناری"
            title="باز کردن منو"
          >
            <PanelRightOpen size={21} />
          </button>
        )}

        <div className="header-title">
          <h2>
            موسسه حمل و نقل کامران
          </h2>

          <span>
            سیستم مدیریت حمل‌ونقل
          </span>
        </div>

      </div>

      {/* سمت چپ هدر */}

      <div className="header-left">

        {/* کاربر */}

        <div className="header-user">

          <User size={18} />

          <div className="header-user-content">

            <span>
              کاربر
            </span>

            <strong>
              {currentUser?.username || "—"}
            </strong>

          </div>

        </div>

        {/* خروج */}

        <button
          className="header-logout-button"
          onClick={handleLogout}
          disabled={loggingOut}
          title="خروج از حساب"
          aria-label="خروج از حساب"
        >
          <LogOut size={18} />

          <span>
            {loggingOut
              ? "در حال خروج..."
              : "خروج"}
          </span>
        </button>

        {/* تاریخ و ساعت */}

        <div className="header-date">

          <CalendarDays size={18} />

          <div className="live-date-content">

            <span className="live-date">
              {liveDate.date}
            </span>

            <strong className="live-time">
              {liveDate.time}
            </strong>

          </div>

        </div>

        {/* وضعیت سرور */}

        <div className="connection-status">

          <Wifi size={18} />

          <span>
            سرور متصل
          </span>

        </div>

        {/* تم */}

        <button
          className="theme-button"
          onClick={toggleTheme}
          aria-label="تغییر حالت نمایش"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

      </div>

    </header>
  );
}