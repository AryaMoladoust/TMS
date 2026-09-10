import "./globals.css";

export const metadata = {
  title: "سرویس حمل‌ونقل باربری",
  description:
    "سیستم مدیریت حمل‌ونقل باربری",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}