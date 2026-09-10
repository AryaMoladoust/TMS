"use client";

import {
  Menu,
  Sun,
  Moon,
  CalendarDays,
  Wifi,
} from "lucide-react";

import { useEffect, useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "tms-theme"
      );

    if (savedTheme === "dark") {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );
    }
  }, []);

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
      new CustomEvent(
        "open-mobile-menu"
      )
    );
  }

  return (
    <header className="header">
      <div className="header-right">
        <button
          className="mobile-menu-button"
          onClick={openMobileMenu}
        >
          <Menu size={22} />
        </button>

        <div className="header-title">
          <h2>
            TMS باربری
          </h2>

          <span>
            سیستم مدیریت حمل‌ونقل
          </span>
        </div>
      </div>

      <div className="header-left">
        <div className="header-date">
          <CalendarDays size={17} />

          <span>
            چهارشنبه، ۱۹ شهریور ۱۴۰۵
          </span>
        </div>

        <div className="connection-status">
          <Wifi size={17} />

          <span>
            سرور متصل
          </span>
        </div>

        <button
          className="theme-button"
          onClick={toggleTheme}
        >
          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>
      </div>
    </header>
  );
}