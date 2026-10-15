/**
 * تاریخ امروز به وقت تهران (YYYY-MM-DD).
 * باید با getTodayKey در API ورود روزانه یکی باشد تا اگر سرور روی
 * منطقه زمانی دیگری (مثلاً UTC) اجرا شد، بین ۰۰:۰۰ تا ۰۳:۳۰ بامداد
 * ثبت فاکتور برای رانندهٔ ورود روزانه خطا ندهد.
 */
export function getTehranDateKey(now = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Tehran",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);

    const get = (type) =>
        parts.find((part) => part.type === type)?.value;

    return `${get("year")}-${get("month")}-${get("day")}`;
}
