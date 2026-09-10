import "./globals.css";

export const metadata = {
  title: "TMS | سیستم مدیریت حمل‌ونقل",
  description: "سیستم مدیریت حمل‌ونقل باربری",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}