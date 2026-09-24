"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PersianDatePicker from "@/components/drivers/PersianDatePicker";
import InvoicePreview from "@/components/invoices/InvoicePreview";

import {
    ArrowRight,
    UserRound,
    Search,
    CreditCard,
    FileText,
    Truck,
    CalendarDays,
    Clock3,
    Package,
    Building2,
    MapPin,
    Route,
    Banknote,
    ShieldCheck,
    HardHat,
    Scale,
    CircleStop,
    UserCheck,
    Save,
    Percent,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

const vehicleTypeLabels = {
    truck: "کامیون",
    trailer: "تریلی",
    pickup: "وانت",
    van: "وانت",
    کامیون: "کامیون",
    تریلی: "تریلی",
    نیسان: "نیسان",
    وانت: "وانت",
};

function getVehicleTypeLabel(value) {
    return vehicleTypeLabels[value] || value || "";
}

/* =========================================================
   COMPANY INFORMATION
   فعلاً برای پیش‌نمایش
========================================================= */

const companyData = {
    name: "موسسه حمل و نقل کامران",
    manager: "کامران صمدیان بهدانی",
    mobile: "09111328288",
    phone: "33883484 - 33882084",
    address: "تهران، خیابان آزادی، پلاک ۱۲۳",
};

/* =========================================================
   NUMBER TO PERSIAN WORDS
========================================================= */

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

function numberToPersianWords(value) {
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

function createPreviewInvoiceNumber() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    const millisecond = String(now.getMilliseconds()).padStart(3, "0");

    return `INV-${year}${month}${day}-${hour}${minute}${second}${millisecond}`;
}

/* =========================================================
   PAGE
========================================================= */

export default function AddInvoicePage() {
    /* =======================================================
       GENERAL STATE
    ======================================================= */

    const [preview, setPreview] = useState(false);

    const [dataLoading, setDataLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [drivers, setDrivers] = useState([]);
    const [loads, setLoads] = useState([]);

    /* =======================================================
       DRIVER STATE
    ======================================================= */

    const [selectedDriver, setSelectedDriver] = useState(null);
    const [manualDriver, setManualDriver] = useState(false);

    const [driverSearch, setDriverSearch] = useState("");
    const [driverSearchOpen, setDriverSearchOpen] = useState(false);

    const [driverData, setDriverData] = useState({
        name: "",
        nationalId: "",
        licenseNumber: "",
        vehicleId: "",
        vehicleType: "",
        plate: "",
    });

    /* =======================================================
       LOAD STATE
    ======================================================= */

    const [selectedLoad, setSelectedLoad] = useState(null);
    const [manualLoad, setManualLoad] = useState(false);

    const [loadSearch, setLoadSearch] = useState("");
    const [loadSearchOpen, setLoadSearchOpen] = useState(false);

    const [loadData, setLoadData] = useState({
        title: "",
        barType: "",
        companyName: "",
        origin: "",
        destination: "",
        distance: "",
        address: "",
        status: "",
    });

    /* =======================================================
       INVOICE STATE
    ======================================================= */

    const [invoiceDate, setInvoiceDate] = useState(null);
    const [previewInvoiceNumber, setPreviewInvoiceNumber] = useState("");

    const [invoiceData, setInvoiceData] = useState({
        startTime: "",
        cost: "",
        costType: "credit",
        insuranceCost: "",
        workerCost: "",
        scaleCost: "",
        stopCost: "",
        commissionCost: "",
        description: "",
        receiverName: "",
    });

    /* =======================================================
       LOAD DATABASE DATA
    ======================================================= */

    useEffect(() => {
        async function loadDataFromDatabase() {
            try {
                setDataLoading(true);

                const [driversResponse, loadsResponse] =
                    await Promise.all([
                        fetch("/api/daily-drivers"),
                        fetch("/api/loads"),
                    ]);

                if (!driversResponse.ok) {
                    throw new Error(
                        "خطا در دریافت رانندگان روزانه"
                    );
                }

                if (!loadsResponse.ok) {
                    throw new Error(
                        "خطا در دریافت بارها"
                    );
                }

                const driversResult =
                    await driversResponse.json();

                const loadsResult =
                    await loadsResponse.json();

                const driversList = Array.isArray(
                    driversResult
                )
                    ? driversResult
                    : driversResult.dailyDrivers || [];

                const loadsList = Array.isArray(
                    loadsResult
                )
                    ? loadsResult
                    : loadsResult.loads || [];

                setDrivers(driversList);
                setLoads(loadsList);
            } catch (error) {
                console.error(
                    "Invoice form data error:",
                    error
                );

                alert(
                    "دریافت اطلاعات رانندگان یا بارها با خطا مواجه شد."
                );
            } finally {
                setDataLoading(false);
            }
        }

        loadDataFromDatabase();
    }, []);

    /* =======================================================
       DRIVER SEARCH
    ======================================================= */

    const filteredDrivers = drivers.filter((driver) =>
        (driver.name || "")
            .toLowerCase()
            .includes(
                driverSearch.trim().toLowerCase()
            )
    );

    function selectDriver(driver) {
        setSelectedDriver(driver);
        setManualDriver(false);

        const isGuest = driver.type === "guest";

        const realDriver =
            driver.driverId &&
            typeof driver.driverId === "object"
                ? driver.driverId
                : null;

        setDriverData({
            name: driver.name || "",

            nationalId: isGuest
                ? ""
                : realDriver?.nationalId || "",

            licenseNumber: isGuest
                ? ""
                : realDriver?.licenseNumber || "",

            vehicleId: isGuest
                ? ""
                : realDriver?._id || "",

            vehicleType:
                getVehicleTypeLabel(
                    driver.vehicleType ||
                        realDriver?.vehicleType ||
                        ""
                ),

            plate: isGuest
                ? ""
                : realDriver?.vehiclePlate || "",
        });

        setDriverSearch(
            driver.name || ""
        );

        setDriverSearchOpen(false);
    }

    function enableManualDriver() {
        setSelectedDriver(null);
        setManualDriver(true);

        setDriverData({
            name: "",
            nationalId: "",
            licenseNumber: "",
            vehicleId: "",
            vehicleType: "",
            plate: "",
        });

        setDriverSearch("");
        setDriverSearchOpen(false);
    }

    function clearDriver() {
        setSelectedDriver(null);
        setManualDriver(false);

        setDriverData({
            name: "",
            nationalId: "",
            licenseNumber: "",
            vehicleId: "",
            vehicleType: "",
            plate: "",
        });

        setDriverSearch("");
    }

    function editDriverField(field, value) {
        setDriverData((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    /* =======================================================
       LOAD SEARCH
    ======================================================= */

    const filteredLoads = loads.filter((load) =>
        (load.title || "")
            .toLowerCase()
            .includes(
                loadSearch.trim().toLowerCase()
            )
    );

    function selectLoad(load) {
        setSelectedLoad(load);
        setManualLoad(false);

        const companyName =
            load.companyId?.name ||
            load.company?.name ||
            load.companyName ||
            "";

        const provinceStatus =
            load.provinceStatus === "outside"
                ? "خارج استان"
                : load.provinceStatus === "inside"
                    ? "داخل استان"
                    : load.status || "";

        setLoadData({
            title: load.title || "",
            barType: load.barType || "",
            companyName,
            origin: load.origin || "",
            destination: load.destination || "",
            distance: load.distance ?? "",
            address: load.address || "",
            status: provinceStatus,
        });

        setLoadSearch(
            load.title || ""
        );

        setLoadSearchOpen(false);
    }

    function enableManualLoad() {
        setSelectedLoad(null);
        setManualLoad(true);

        setLoadData({
            title: "",
            barType: "",
            companyName: "",
            origin: "",
            destination: "",
            distance: "",
            address: "",
            status: "",
        });

        setLoadSearch("");
        setLoadSearchOpen(false);
    }

    function clearLoad() {
        setSelectedLoad(null);
        setManualLoad(false);

        setLoadData({
            title: "",
            barType: "",
            companyName: "",
            origin: "",
            destination: "",
            distance: "",
            address: "",
            status: "",
        });

        setLoadSearch("");
    }

    function editLoadField(field, value) {
        setLoadData((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    /* =======================================================
       INVOICE FIELDS
    ======================================================= */

    function editInvoiceField(field, value) {
        setInvoiceData((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    /* =======================================================
       PREVIEW
    ======================================================= */

    function getPreviewInvoice() {
        const mainCost =
            Number(invoiceData.cost || 0);

        const insurance =
            Number(invoiceData.insuranceCost || 0);

        const workerCost =
            Number(invoiceData.workerCost || 0);

        const scaleCost =
            Number(invoiceData.scaleCost || 0);

        const stopCost =
            Number(invoiceData.stopCost || 0);

        const commissionCost =
            Number(invoiceData.commissionCost || 0);

        const totalAmount =
            mainCost +
            insurance +
            workerCost +
            scaleCost +
            stopCost +
            commissionCost;

        return {
            companyName: companyData.name,
            companyManager: companyData.manager,
            companyMobile: companyData.mobile,
            companyPhone: companyData.phone,
            companyAddress: companyData.address,

            number:
                previewInvoiceNumber ||
                "—",

            date:
                invoiceDate
                    ? invoiceDate.format(
                        "YYYY/MM/DD"
                    )
                    : "—",

            startTime:
                invoiceData.startTime ||
                "—",

            driver:
                driverData.name ||
                "—",

            vehicle:
                driverData.vehicleType ||
                "—",

            plate:
                driverData.plate ||
                "—",

            clientCompanyName:
                loadData.companyName ||
                "—",

            cargoType:
                loadData.barType ||
                "—",

            origin:
                loadData.origin ||
                "—",

            destination:
                loadData.destination ||
                "—",

            distance:
                loadData.distance
                    ? `${loadData.distance} کیلومتر`
                    : "—",

            loadAddress:
                loadData.address ||
                "—",

            loadStatus:
                loadData.status ||
                "—",

            cost:
                mainCost.toLocaleString(
                    "fa-IR"
                ),

            insurance:
                insurance.toLocaleString(
                    "fa-IR"
                ),

            workerCost:
                workerCost.toLocaleString(
                    "fa-IR"
                ),

            scaleCost:
                scaleCost.toLocaleString(
                    "fa-IR"
                ),

            stopCost:
                stopCost.toLocaleString(
                    "fa-IR"
                ),

            commissionCost:
                commissionCost.toLocaleString(
                    "fa-IR"
                ),

            total:
                totalAmount.toLocaleString(
                    "fa-IR"
                ),

            totalInWords:
                `${numberToPersianWords(
                    totalAmount
                )} تومان`,

            receiverName:
                invoiceData.receiverName ||
                "—",

            description:
                invoiceData.description ||
                "",
        };
    }

    /* =======================================================
       SUBMIT
    ======================================================= */

    async function handleSubmit(event) {
        event.preventDefault();

        const invoiceNumber =
            previewInvoiceNumber ||
            createPreviewInvoiceNumber();

        if (!previewInvoiceNumber) {
            setPreviewInvoiceNumber(invoiceNumber);
        }

        if (!invoiceDate) {
            alert("تاریخ فاکتور را انتخاب کنید.");
            return;
        }

        if (!driverData.name.trim()) {
            alert("نام راننده را وارد کنید.");
            return;
        }

        if (!driverData.vehicleType.trim()) {
            alert("نوع خودرو را انتخاب کنید.");
            return;
        }

        if (!invoiceData.cost) {
            alert("هزینه اصلی را وارد کنید.");
            return;
        }

        try {
            setSaving(true);

            const realDriverId =
                selectedDriver?.driverId &&
                typeof selectedDriver.driverId === "object"
                    ? selectedDriver.driverId._id
                    : selectedDriver?.driverId || null;

            const isGuest =
                selectedDriver?.type === "guest";

            const driverType =
                manualDriver
                    ? "manual"
                    : isGuest
                        ? "guest"
                        : "main";

            const invoicePayload = {
                invoiceNumber,

                date:
                    invoiceDate.format(
                        "YYYY/MM/DD"
                    ),

                startTime:
                    invoiceData.startTime,

                dailyDriverId:
                    selectedDriver?._id ||
                    null,

                driverType,

                driverId:
                    driverType === "main"
                        ? realDriverId
                        : null,

                driverName:
                    driverData.name.trim(),

                driverPhone:
                    selectedDriver?.phone ||
                    "",

                driverNationalId:
                    driverData.nationalId.trim(),

                driverLicenseNumber:
                    driverData.licenseNumber.trim(),

                vehicleId:
                    driverData.vehicleId.trim(),

                vehicleType:
                    driverData.vehicleType.trim(),

                vehiclePlate:
                    driverData.plate.trim(),

                loadId:
                    selectedLoad?._id ||
                    null,

                loadType:
                    loadData.barType.trim(),

                companyId:
                    selectedLoad?.companyId?._id ||
                    selectedLoad?.companyId ||
                    selectedLoad?.company?._id ||
                    null,

                companyName:
                    loadData.companyName.trim(),

                origin:
                    loadData.origin.trim(),

                destination:
                    loadData.destination.trim(),

                distance:
                    Number(
                        loadData.distance
                    ) || 0,

                address:
                    loadData.address.trim(),

                cost:
                    Number(
                        invoiceData.cost
                    ) || 0,

                costType:
                    invoiceData.costType === "credit"
                        ? "اعتباری"
                        : "نقد",

                insuranceCost:
                    Number(
                        invoiceData.insuranceCost
                    ) || 0,

                workerCost:
                    Number(
                        invoiceData.workerCost
                    ) || 0,

                scaleCost:
                    Number(
                        invoiceData.scaleCost
                    ) || 0,

                stopCost:
                    Number(
                        invoiceData.stopCost
                    ) || 0,

                commissionCost:
                    Number(
                        invoiceData.commissionCost
                    ) || 0,

                description:
                    invoiceData.description.trim(),

                receiverName:
                    invoiceData.receiverName.trim(),
            };

            const response = await fetch(
                "/api/invoices",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        invoicePayload
                    ),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ||
                    "ثبت فاکتور ناموفق بود."
                );
            }

            alert(
                "فاکتور با موفقیت ثبت شد."
            );

            window.location.href =
                "/invoices";
        } catch (error) {
            console.error(
                "Create invoice error:",
                error
            );

            alert(
                error.message ||
                "ثبت فاکتور با خطا مواجه شد."
            );
        } finally {
            setSaving(false);
        }
    }

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <main className="main-content">

            {/* PAGE HEADING */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <div className="page-back-link">

                        <Link href="/invoices">

                            <ArrowRight size={17} />

                            بازگشت به فاکتورها

                        </Link>

                    </div>

                    <h1>
                        ثبت فاکتور
                    </h1>

                    <p>
                        اطلاعات راننده، بار، هزینه و گیرنده را وارد کنید
                    </p>

                </div>

            </div>


            {/* FORM PANEL */}

            <section className="invoice-form-panel">

                {/* HEADER */}

                <div className="invoice-form-header">

                    <div className="invoice-form-header-icon">

                        <FileText size={24} />

                    </div>

                    <div>

                        <h2>
                            اطلاعات فاکتور
                        </h2>

                        <p>
                            اطلاعات موردنیاز فاکتور و حواله راننده
                        </p>

                    </div>

                </div>


                {dataLoading && (

                    <div
                        style={{
                            padding: "14px 18px",
                            margin: "0 0 10px",
                            borderRadius: "12px",
                            background: "var(--surface-soft)",
                            color: "var(--text-secondary)",
                            textAlign: "center",
                        }}
                    >
                        در حال دریافت اطلاعات رانندگان و بارها...
                    </div>

                )}


                <form
                    className="invoice-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        DRIVER
                    ================================================== */}

                    <div className="invoice-form-section-title">

                        <UserRound size={19} />

                        <span>
                            اطلاعات راننده
                        </span>

                    </div>


                    {/* DRIVER SEARCH */}

                    <div className="invoice-search-group invoice-form-full">

                        <label>
                            انتخاب راننده
                        </label>

                        {!manualDriver && (

                            <div className="invoice-search-container">

                                <div className="invoice-search-input-wrapper">

                                    <Search size={18} />

                                    <input
                                        type="text"
                                        value={driverSearch}
                                        onChange={(event) => {

                                            setDriverSearch(
                                                event.target.value
                                            );

                                            setDriverSearchOpen(
                                                true
                                            );

                                            setSelectedDriver(
                                                null
                                            );

                                        }}
                                        onFocus={() =>
                                            setDriverSearchOpen(
                                                true
                                            )
                                        }
                                        placeholder="نام راننده را جستجو کنید..."
                                    />

                                </div>


                                {driverSearchOpen && (

                                    <div className="invoice-search-dropdown">

                                        {filteredDrivers.length > 0 ? (

                                            filteredDrivers.map(
                                                (driver) => {

                                                    const isGuest =
                                                        driver.type === "guest";

                                                    const realDriver =
                                                        driver.driverId &&
                                                        typeof driver.driverId === "object"
                                                            ? driver.driverId
                                                            : null;

                                                    const driverIdText =
                                                        realDriver?._id ||
                                                        driver.driverId ||
                                                        driver._id ||
                                                        "";

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={driver._id}
                                                            className="invoice-search-option"
                                                            onClick={() =>
                                                                selectDriver(
                                                                    driver
                                                                )
                                                            }
                                                        >

                                                            <div className="invoice-option-icon">

                                                                <UserRound
                                                                    size={18}
                                                                />

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {driver.name}
                                                                </strong>

                                                                <span>
                                                                    {isGuest
                                                                        ? "راننده مهمان"
                                                                        : "راننده اصلی"}
                                                                    {" - "}
                                                                    {getVehicleTypeLabel(
                                                                        driver.vehicleType
                                                                    )}
                                                                    {driverIdText
                                                                        ? ` - ${driverIdText}`
                                                                        : ""}
                                                                </span>

                                                            </div>

                                                        </button>
                                                    );
                                                }
                                            )

                                        ) : (

                                            <div className="invoice-search-empty">

                                                راننده‌ای برای امروز پیدا نشد

                                            </div>

                                        )}


                                        <button
                                            type="button"
                                            className="invoice-manual-button"
                                            onClick={
                                                enableManualDriver
                                            }
                                        >
                                            + ورود دستی اطلاعات راننده
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}


                        {manualDriver && (

                            <div className="invoice-manual-mode">

                                <div className="invoice-manual-mode-header">

                                    <span>
                                        ورود دستی اطلاعات راننده
                                    </span>

                                    <button
                                        type="button"
                                        onClick={clearDriver}
                                    >
                                        انتخاب راننده موجود
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* DRIVER NAME */}

                    <div className="invoice-form-group">

                        <label>
                            نام راننده
                        </label>

                        <div className="invoice-input-wrapper">

                            <UserRound size={18} />

                            <input
                                value={driverData.name}
                                onChange={(event) =>
                                    editDriverField(
                                        "name",
                                        event.target.value
                                    )
                                }
                                placeholder="نام و نام خانوادگی"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>


                    {/* NATIONAL ID */}

                    <div className="invoice-form-group">

                        <label>
                            کد ملی
                        </label>

                        <div className="invoice-input-wrapper">

                            <CreditCard size={18} />

                            <input
                                value={driverData.nationalId}
                                onChange={(event) =>
                                    editDriverField(
                                        "nationalId",
                                        event.target.value
                                    )
                                }
                                placeholder="کد ملی"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>


                    {/* LICENSE */}

                    <div className="invoice-form-group">

                        <label>
                            شماره گواهینامه
                        </label>

                        <div className="invoice-input-wrapper">

                            <CreditCard size={18} />

                            <input
                                value={driverData.licenseNumber}
                                onChange={(event) =>
                                    editDriverField(
                                        "licenseNumber",
                                        event.target.value
                                    )
                                }
                                placeholder="شماره گواهینامه"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>


                    {/* VEHICLE ID */}

                    <div className="invoice-form-group">

                        <label>
                            Vehicle ID
                        </label>

                        <div className="invoice-input-wrapper">

                            <Truck size={18} />

                            <input
                                value={driverData.vehicleId}
                                onChange={(event) =>
                                    editDriverField(
                                        "vehicleId",
                                        event.target.value
                                    )
                                }
                                placeholder="شناسه خودرو"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>


                    {/* VEHICLE TYPE */}

                    <div className="invoice-form-group">

                        <label>
                            نوع خودرو
                        </label>

                        <div className="invoice-input-wrapper">

                            <Truck size={18} />

                            <select
                                value={driverData.vehicleType}
                                onChange={(event) =>
                                    editDriverField(
                                        "vehicleType",
                                        event.target.value
                                    )
                                }
                                disabled={!!selectedDriver}
                            >

                                <option value="">
                                    انتخاب نوع خودرو
                                </option>

                                <option value="کامیون">
                                    کامیون
                                </option>

                                <option value="تریلی">
                                    تریلی
                                </option>

                                <option value="نیسان">
                                    نیسان
                                </option>

                                <option value="وانت">
                                    وانت
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* PLATE */}

                    <div className="invoice-form-group">

                        <label>
                            پلاک
                        </label>

                        <div className="invoice-input-wrapper">

                            <CreditCard size={18} />

                            <input
                                value={
                                    driverData.plate ?? ""
                                }
                                onChange={(event) =>
                                    editDriverField(
                                        "plate",
                                        event.target.value
                                    )
                                }
                                placeholder="مثلاً ۱۲ ایران ۳۴۵ ب۶۷"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        INVOICE INFORMATION
                    ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <FileText size={19} />

                        <span>
                            اطلاعات فاکتور
                        </span>

                    </div>


                    {/* DATE */}

                    <div className="invoice-form-group">

                        <label>
                            تاریخ <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper invoice-date-wrapper">

                            <CalendarDays size={18} />

                            <PersianDatePicker
                                value={invoiceDate}
                                onChange={
                                    setInvoiceDate
                                }
                                placeholder="تاریخ فاکتور را انتخاب کنید"
                            />

                        </div>

                    </div>


                    {/* START TIME */}

                    <div className="invoice-form-group">

                        <label>
                            ساعت شروع
                        </label>

                        <div className="invoice-input-wrapper">

                            <Clock3 size={18} />

                            <input
                                type="time"
                                value={
                                    invoiceData.startTime
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "startTime",
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        LOAD INFORMATION
                    ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <Package size={19} />

                        <span>
                            اطلاعات بار
                        </span>

                    </div>


                    {/* LOAD SEARCH */}

                    <div className="invoice-search-group invoice-form-full">

                        <label>
                            انتخاب بار
                        </label>

                        {!manualLoad && (

                            <div className="invoice-search-container">

                                <div className="invoice-search-input-wrapper">

                                    <Search size={18} />

                                    <input
                                        type="text"
                                        value={loadSearch}
                                        onChange={(event) => {

                                            setLoadSearch(
                                                event.target.value
                                            );

                                            setLoadSearchOpen(
                                                true
                                            );

                                            setSelectedLoad(
                                                null
                                            );

                                        }}
                                        onFocus={() =>
                                            setLoadSearchOpen(
                                                true
                                            )
                                        }
                                        placeholder="عنوان بار را جستجو کنید..."
                                    />

                                </div>


                                {loadSearchOpen && (

                                    <div className="invoice-search-dropdown">

                                        {filteredLoads.length > 0 ? (

                                            filteredLoads.map(
                                                (load) => {

                                                    const companyName =
                                                        load.companyId?.name ||
                                                        load.company?.name ||
                                                        load.companyName ||
                                                        "";

                                                    return (
                                                        <button
                                                            type="button"
                                                            key={load._id}
                                                            className="invoice-search-option"
                                                            onClick={() =>
                                                                selectLoad(
                                                                    load
                                                                )
                                                            }
                                                        >

                                                            <div className="invoice-option-icon">

                                                                <Package
                                                                    size={18}
                                                                />

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {load.title}
                                                                </strong>

                                                                <span>
                                                                    {companyName}
                                                                    {" - "}
                                                                    {load.origin}
                                                                    {" تا "}
                                                                    {load.destination}
                                                                </span>

                                                            </div>

                                                        </button>
                                                    );
                                                }
                                            )

                                        ) : (

                                            <div className="invoice-search-empty">

                                                باری پیدا نشد

                                            </div>

                                        )}


                                        <button
                                            type="button"
                                            className="invoice-manual-button"
                                            onClick={
                                                enableManualLoad
                                            }
                                        >
                                            + ورود دستی اطلاعات بار
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}


                        {manualLoad && (

                            <div className="invoice-manual-mode">

                                <div className="invoice-manual-mode-header">

                                    <span>
                                        ورود دستی اطلاعات بار
                                    </span>

                                    <button
                                        type="button"
                                        onClick={clearLoad}
                                    >
                                        انتخاب بار موجود
                                    </button>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* LOAD TITLE */}

                    <div className="invoice-form-group">

                        <label>
                            عنوان بار
                        </label>

                        <div className="invoice-input-wrapper">

                            <Package size={18} />

                            <input
                                value={loadData.title}
                                onChange={(event) =>
                                    editLoadField(
                                        "title",
                                        event.target.value
                                    )
                                }
                                placeholder="عنوان بار"
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>


                    {/* BAR TYPE */}

                    <div className="invoice-form-group">

                        <label>
                            نوع بار
                        </label>

                        <div className="invoice-input-wrapper">

                            <Package size={18} />

                            <select
                                value={loadData.barType}
                                onChange={(event) =>
                                    editLoadField(
                                        "barType",
                                        event.target.value
                                    )
                                }
                                disabled={!!selectedLoad}
                            >

                                <option value="">
                                    انتخاب نوع بار
                                </option>

                                <option value="مواد غذایی">
                                    مواد غذایی
                                </option>

                                <option value="قطعات صنعتی">
                                    قطعات صنعتی
                                </option>

                                <option value="مصالح ساختمانی">
                                    مصالح ساختمانی
                                </option>

                                <option value="محصولات کشاورزی">
                                    محصولات کشاورزی
                                </option>

                                <option value="سایر">
                                    سایر
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* LOAD STATUS */}

                    <div className="invoice-form-group">

                        <label>
                            وضعیت بار
                        </label>

                        <div className="invoice-input-wrapper">

                            <Route size={18} />

                            <select
                                value={loadData.status}
                                onChange={(event) =>
                                    editLoadField(
                                        "status",
                                        event.target.value
                                    )
                                }
                                disabled={!!selectedLoad}
                            >

                                <option value="">
                                    انتخاب وضعیت بار
                                </option>

                                <option value="داخل استان">
                                    داخل استان
                                </option>

                                <option value="خارج استان">
                                    خارج استان
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* COMPANY */}

                    <div className="invoice-form-group">

                        <label>
                            نام شرکت
                        </label>

                        <div className="invoice-input-wrapper">

                            <Building2 size={18} />

                            <input
                                value={
                                    loadData.companyName
                                }
                                onChange={(event) =>
                                    editLoadField(
                                        "companyName",
                                        event.target.value
                                    )
                                }
                                placeholder="نام شرکت"
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>


                    {/* ORIGIN */}

                    <div className="invoice-form-group">

                        <label>
                            مبدأ
                        </label>

                        <div className="invoice-input-wrapper">

                            <MapPin size={18} />

                            <input
                                value={
                                    loadData.origin
                                }
                                onChange={(event) =>
                                    editLoadField(
                                        "origin",
                                        event.target.value
                                    )
                                }
                                placeholder="مبدأ"
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>


                    {/* DESTINATION */}

                    <div className="invoice-form-group">

                        <label>
                            مقصد
                        </label>

                        <div className="invoice-input-wrapper">

                            <MapPin size={18} />

                            <input
                                value={
                                    loadData.destination
                                }
                                onChange={(event) =>
                                    editLoadField(
                                        "destination",
                                        event.target.value
                                    )
                                }
                                placeholder="مقصد"
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>


                    {/* DISTANCE */}

                    <div className="invoice-form-group">

                        <label>
                            مسافت
                        </label>

                        <div className="invoice-input-wrapper">

                            <Route size={18} />

                            <input
                                value={
                                    loadData.distance
                                }
                                onChange={(event) =>
                                    editLoadField(
                                        "distance",
                                        event.target.value
                                    )
                                }
                                placeholder="مثلاً ۳۲۵"
                                disabled={!!selectedLoad}
                            />

                            <span className="invoice-input-unit">
                                کیلومتر
                            </span>

                        </div>

                    </div>


                    {/* ADDRESS */}

                    <div className="invoice-form-group invoice-form-full">

                        <label>
                            آدرس
                        </label>

                        <div className="invoice-input-wrapper invoice-textarea-wrapper">

                            <MapPin size={18} />

                            <textarea
                                value={
                                    loadData.address
                                }
                                onChange={(event) =>
                                    editLoadField(
                                        "address",
                                        event.target.value
                                    )
                                }
                                placeholder="آدرس محل بارگیری..."
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        COSTS
                    ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <Banknote size={19} />

                        <span>
                            هزینه‌ها
                        </span>

                    </div>


                    {/* MAIN COST */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه اصلی <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper">

                            <Banknote size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.cost
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "cost",
                                        event.target.value
                                    )
                                }
                                placeholder="مبلغ هزینه"
                                required
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* PAYMENT TYPE */}

                    <div className="invoice-form-group">

                        <label>
                            نوع پرداخت <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper">

                            <Banknote size={18} />

                            <select
                                value={
                                    invoiceData.costType
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "costType",
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="credit">
                                    اعتباری
                                </option>

                                <option value="cash">
                                    نقد
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* INSURANCE */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه بیمه
                        </label>

                        <div className="invoice-input-wrapper">

                            <ShieldCheck size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.insuranceCost
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "insuranceCost",
                                        event.target.value
                                    )
                                }
                                placeholder="هزینه بیمه"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* WORKER */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه کارگر
                        </label>

                        <div className="invoice-input-wrapper">

                            <HardHat size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.workerCost
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "workerCost",
                                        event.target.value
                                    )
                                }
                                placeholder="هزینه کارگر"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* SCALE */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه باسکول
                        </label>

                        <div className="invoice-input-wrapper">

                            <Scale size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.scaleCost
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "scaleCost",
                                        event.target.value
                                    )
                                }
                                placeholder="هزینه باسکول"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* STOP */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه توقف
                        </label>

                        <div className="invoice-input-wrapper">

                            <CircleStop size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.stopCost
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "stopCost",
                                        event.target.value
                                    )
                                }
                                placeholder="هزینه توقف"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* COMMISSION */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه کمیسیون شرکت
                        </label>

                        <div className="invoice-input-wrapper">

                            <Percent size={18} />

                            <input
                                type="number"
                                min="0"
                                value={
                                    invoiceData.commissionCost ??
                                    ""
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "commissionCost",
                                        event.target.value
                                    )
                                }
                                placeholder="هزینه کمیسیون"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        OTHER INFORMATION
                    ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <FileText size={19} />

                        <span>
                            اطلاعات تکمیلی
                        </span>

                    </div>


                    {/* RECEIVER */}

                    <div className="invoice-form-group">

                        <label>
                            نام گیرنده
                        </label>

                        <div className="invoice-input-wrapper">

                            <UserCheck size={18} />

                            <input
                                value={
                                    invoiceData.receiverName
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "receiverName",
                                        event.target.value
                                    )
                                }
                                placeholder="نام تحویل گیرنده"
                            />

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="invoice-form-group invoice-form-full">

                        <label>
                            توضیحات
                        </label>

                        <div className="invoice-input-wrapper invoice-textarea-wrapper">

                            <FileText size={18} />

                            <textarea
                                rows={4}
                                maxLength={120}
                                value={
                                    invoiceData.description
                                }
                                onChange={(event) =>
                                    editInvoiceField(
                                        "description",
                                        event.target.value
                                    )
                                }
                                placeholder="توضیحات فاکتور..."
                            />

                        </div>

                        <div
                            style={{
                                fontSize: "11px",
                                color: "#94a3b8",
                                marginTop: "4px",
                                textAlign: "left",
                            }}
                        >
                            {
                                invoiceData.description.length
                            }
                            /120
                        </div>

                    </div>


                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div className="invoice-form-actions">

                        <Link
                            href="/invoices"
                            className="invoice-cancel-button"
                        >
                            انصراف
                        </Link>


                        <button
                            type="submit"
                            className="primary-action-button"
                            disabled={
                                saving ||
                                dataLoading
                            }
                        >

                            <Save size={19} />

                            <span>
                                {saving
                                    ? "در حال ثبت..."
                                    : "ثبت فاکتور"}
                            </span>

                        </button>


                        <button
                            type="button"
                            className="primary-action-button"
                            onClick={() => {
                                if (!previewInvoiceNumber) {
                                    setPreviewInvoiceNumber(
                                        createPreviewInvoiceNumber()
                                    );
                                }
                                setPreview(true);
                            }}
                        >
                            پیش‌نمایش فاکتور
                        </button>

                    </div>

                </form>

            </section>


            {/* =====================================================
                INVOICE PREVIEW
            ====================================================== */}

            {preview && (

                <InvoicePreview
                    onClose={() =>
                        setPreview(false)
                    }
                    invoice={
                        getPreviewInvoice()
                    }
                />

            )}

        </main>
    );
}