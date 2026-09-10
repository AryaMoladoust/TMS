"use client";

import {
  Menu,
  Sun,
  Moon,
  CalendarDays,
  Wifi,
  PanelRightOpen,
} from "lucide-react";

import { useEffect, useState } from "react";

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

function gregorianToJalali(
  gy,
  gm,
  gd
) {
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

  const gy2 =
    gm > 2 ? gy + 1 : gy;

  let days =
    365 * gy +
    Math.floor(
      (gy2 + 3) / 4
    ) -
    Math.floor(
      (gy2 + 99) / 100
    ) +
    Math.floor(
      (gy2 + 399) / 400
    ) -
    80 +
    gd +
    gdm[gm - 1];

  jy +=
    33 *
    Math.floor(
      days / 12053
    );

  days %= 12053;

  jy +=
    4 *
    Math.floor(
      days / 1461
    );

  days %= 1461;

  if (days > 365) {
    jy += Math.floor(
      (days - 1) / 365
    );

    days =
      (days - 1) % 365;
  }

  let jm;

  if (days < 186) {
    jm =
      1 +
      Math.floor(
        days / 31
      );
  } else {
    jm =
      7 +
      Math.floor(
        (days - 186) / 30
      );
  }

  const jd =
    1 +
    (days < 186
      ? days % 31
      : (days - 186) % 30);

  return [
    jy,
    jm,
    jd,
  ];
}

function toPersianNumber(
  number
) {
  return String(number).replace(
    /\d/g,
    (digit) =>
      "۰۱۲۳۴۵۶۷۸۹"[digit]
  );
}

function getLiveDate() {
  const now = new Date();

  const [
    jy,
    jm,
    jd,
  ] = gregorianToJalali(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate()
  );

  const weekday =
    persianWeekdays[
      now.getDay()
    ];

  const time =
    now.toLocaleTimeString(
      "fa-IR",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }
    );

  return {
    date: `${weekday}، ${toPersianNumber(
      jd
    )} ${
      persianMonths[jm - 1]
    } ${toPersianNumber(jy)}`,

    time,
  };
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}) {
  const [darkMode, setDarkMode] =
    useState(false);

  const [liveDate, setLiveDate] =
    useState({
      date: "",
      time: "",
    });

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "tms-theme"
      );

    if (
      savedTheme === "dark"
    ) {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );
    }

    setLiveDate(
      getLiveDate()
    );

    const timer =
      setInterval(() => {
        setLiveDate(
          getLiveDate()
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);

  function toggleTheme() {
    const nextMode =
      !darkMode;

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
      new CustomEvent(
        "open-mobile-menu"
      )
    );
  }

  function openSidebar() {
    setSidebarOpen(true);
  }

  return (
    <header className="header">
      <div className="header-right">
        {/* موبایل */}
        <button
          className="mobile-menu-button"
          onClick={openMobileMenu}
          aria-label="باز کردن منو"
        >
          <Menu size={23} />
        </button>

        {/* دسکتاپ - وقتی Sidebar بسته است */}
        {!sidebarOpen && (
          <button
            className="desktop-sidebar-open-button"
            onClick={openSidebar}
            aria-label="باز کردن منوی کناری"
            title="باز کردن منو"
          >
            <PanelRightOpen
              size={21}
            />
          </button>
        )}

        <div className="header-title">
          <h2>
            سرویس حمل‌ونقل باربری
          </h2>

          <span>
            سیستم مدیریت حمل‌ونقل
          </span>
        </div>
      </div>

      <div className="header-left">
        <div className="header-date">
          <CalendarDays size={18} />

          <div className="live-date-content">
            <span>
              {liveDate.date}
            </span>

            <strong>
              {liveDate.time}
            </strong>
          </div>
        </div>

        <div className="connection-status">
          <Wifi size={18} />
          <span>
            سرور متصل
          </span>
        </div>

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