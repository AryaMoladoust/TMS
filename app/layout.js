import "./globals.css";

export const metadata = {
  title: "سرویس حمل‌ونقل باربری",
  description: "سیستم مدیریت حمل‌ونقل باربری",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("tms-theme");

                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}