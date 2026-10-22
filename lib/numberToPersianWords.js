// تبدیل عدد به حروف فارسی (برای «مبلغ به حروف» فاکتور)

const persianOnes = [
    "",
    "یک",
    "دو",
    "سه",
    "چهار",
    "پنج",
    "شش",
    "هفت",
    "هشت",
    "نه",
];

const persianTeens = [
    "ده",
    "یازده",
    "دوازده",
    "سیزده",
    "چهارده",
    "پانزده",
    "شانزده",
    "هفده",
    "هجده",
    "نوزده",
];

const persianTens = [
    "",
    "ده",
    "بیست",
    "سی",
    "چهل",
    "پنجاه",
    "شصت",
    "هفتاد",
    "هشتاد",
    "نود",
];

const persianHundreds = [
    "",
    "صد",
    "دویست",
    "سیصد",
    "چهارصد",
    "پانصد",
    "ششصد",
    "هفتصد",
    "هشتصد",
    "نهصد",
];

const persianScales = [
    "",
    "هزار",
    "میلیون",
    "میلیارد",
    "تریلیون",
];

function threeDigitGroupToWords(n) {
    if (n === 0) return "";

    const hundred = Math.floor(n / 100);
    const rest = n % 100;

    const parts = [];

    if (hundred > 0) {
        parts.push(persianHundreds[hundred]);
    }

    if (rest > 0) {
        if (rest < 10) {
            parts.push(persianOnes[rest]);
        } else if (rest < 20) {
            parts.push(persianTeens[rest - 10]);
        } else {
            const tensDigit = Math.floor(rest / 10);
            const onesDigit = rest % 10;

            if (onesDigit === 0) {
                parts.push(persianTens[tensDigit]);
            } else {
                parts.push(
                    `${persianTens[tensDigit]} و ${persianOnes[onesDigit]}`
                );
            }
        }
    }

    return parts.join(" و ");
}

export function numberToPersianWords(value) {
    let n = Math.floor(Math.abs(Number(value) || 0));

    if (n === 0) return "صفر";

    const groups = [];

    while (n > 0) {
        groups.push(n % 1000);
        n = Math.floor(n / 1000);
    }

    const parts = [];

    for (let i = groups.length - 1; i >= 0; i--) {
        if (groups[i] === 0) continue;

        const words = threeDigitGroupToWords(groups[i]);

        parts.push(
            persianScales[i]
                ? `${words} ${persianScales[i]}`
                : words
        );
    }

    return parts.join(" و ");
}
