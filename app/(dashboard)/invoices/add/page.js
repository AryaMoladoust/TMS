"use client";

import Link from "next/link";
import { useState } from "react";
import PersianDatePicker from "@/components/drivers/PersianDatePicker";

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
    QrCode,
    UserCheck,
    Save,
} from "lucide-react";

/* =========================================================
   MOCK DRIVERS
   بعداً از MongoDB / API دریافت می‌شوند
   ========================================================= */

const mockDrivers = [
    {
        id: "DRV-1001",
        name: "علی رضایی",
        nationalId: "۰۰۱۲۳۴۵۶۷۸",
        licenseNumber: "LIC-458721",
        vehicleId: "VEH-1001",
        vehicleType: "کامیون",
    },
    {
        id: "DRV-1002",
        name: "محمد کریمی",
        nationalId: "۰۰۲۳۴۵۶۷۸۹",
        licenseNumber: "LIC-784512",
        vehicleId: "VEH-1002",
        vehicleType: "تریلی",
    },
    {
        id: "DRV-1003",
        name: "رضا احمدی",
        nationalId: "۰۰۳۴۵۶۷۸۹۰",
        licenseNumber: "LIC-321654",
        vehicleId: "VEH-1003",
        vehicleType: "کامیون",
    },
];

/* =========================================================
   MOCK LOADS
   بعداً از MongoDB / API دریافت می‌شوند
   ========================================================= */

const mockLoads = [
    {
        id: "LOAD-1001",
        title: "بار مواد غذایی",
        barType: "مواد غذایی",
        companyName: "شرکت حمل‌ونقل شمال",
        origin: "رشت",
        destination: "تهران",
        distance: "۳۲۵",
        address: "رشت، شهر صنعتی، انبار شماره ۲",
    },
    {
        id: "LOAD-1002",
        title: "قطعات صنعتی",
        barType: "قطعات صنعتی",
        companyName: "صنایع شمال",
        origin: "رشت",
        destination: "قزوین",
        distance: "۲۷۰",
        address: "رشت، جاده تهران، کارخانه صنایع شمال",
    },
    {
        id: "LOAD-1003",
        title: "مصالح ساختمانی",
        barType: "مصالح ساختمانی",
        companyName: "شرکت ساختمانی شمال",
        origin: "رشت",
        destination: "کرج",
        distance: "۳۷۵",
        address: "رشت، جاده انزلی، انبار مصالح",
    },
];

export default function AddInvoicePage() {
    /* =======================================================
       DRIVER STATE
       ======================================================= */

    const [selectedDriver, setSelectedDriver] = useState(null);
    const [manualDriver, setManualDriver] = useState(false);

    const [driverSearch, setDriverSearch] = useState("");
    const [driverSearchOpen, setDriverSearchOpen] = useState(false);

    const [driverData, setDriverData] = useState({
        id: "",
        name: "",
        nationalId: "",
        licenseNumber: "",
        vehicleId: "",
        vehicleType: "",
    });

    /* =======================================================
       LOAD STATE
       ======================================================= */

    const [selectedLoad, setSelectedLoad] = useState(null);
    const [manualLoad, setManualLoad] = useState(false);

    const [loadSearch, setLoadSearch] = useState("");
    const [loadSearchOpen, setLoadSearchOpen] = useState(false);

    const [loadData, setLoadData] = useState({
        id: "",
        title: "",
        barType: "",
        companyName: "",
        origin: "",
        destination: "",
        distance: "",
        address: "",
    });

    /* =======================================================
       INVOICE STATE
       ======================================================= */

    const [invoiceDate, setInvoiceDate] = useState(null);

    const [invoiceData, setInvoiceData] = useState({
        invoiceId: "",
        startTime: "",
        cost: "",
        costType: "credit",
        insuranceCost: "",
        workerCost: "",
        scaleCost: "",
        stopCost: "",
        description: "",
        receiverName: "",
    });

    /* =======================================================
       DRIVER SEARCH
       ======================================================= */

    const filteredDrivers = mockDrivers.filter((driver) =>
        driver.name.includes(driverSearch.trim())
    );

    function selectDriver(driver) {
        setSelectedDriver(driver);
        setManualDriver(false);

        setDriverData({
            id: driver.id,
            name: driver.name,
            nationalId: driver.nationalId,
            licenseNumber: driver.licenseNumber,
            vehicleId: driver.vehicleId,
            vehicleType: driver.vehicleType,
        });

        setDriverSearch(driver.name);
        setDriverSearchOpen(false);
    }

    function enableManualDriver() {
        setSelectedDriver(null);
        setManualDriver(true);

        setDriverData({
            id: "",
            name: "",
            nationalId: "",
            licenseNumber: "",
            vehicleId: "",
            vehicleType: "",
        });

        setDriverSearch("");
        setDriverSearchOpen(false);
    }

    function clearDriver() {
        setSelectedDriver(null);
        setManualDriver(false);

        setDriverData({
            id: "",
            name: "",
            nationalId: "",
            licenseNumber: "",
            vehicleId: "",
            vehicleType: "",
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

    const filteredLoads = mockLoads.filter((load) =>
        load.title.includes(loadSearch.trim())
    );

    function selectLoad(load) {
        setSelectedLoad(load);
        setManualLoad(false);

        setLoadData({
            id: load.id,
            title: load.title,
            barType: load.barType,
            companyName: load.companyName,
            origin: load.origin,
            destination: load.destination,
            distance: load.distance,
            address: load.address,
        });

        setLoadSearch(load.title);
        setLoadSearchOpen(false);
    }

    function enableManualLoad() {
        setSelectedLoad(null);
        setManualLoad(true);

        setLoadData({
            id: "",
            title: "",
            barType: "",
            companyName: "",
            origin: "",
            destination: "",
            distance: "",
            address: "",
        });

        setLoadSearch("");
        setLoadSearchOpen(false);
    }

    function clearLoad() {
        setSelectedLoad(null);
        setManualLoad(false);

        setLoadData({
            id: "",
            title: "",
            barType: "",
            companyName: "",
            origin: "",
            destination: "",
            distance: "",
            address: "",
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
       SUBMIT
       ======================================================= */

    function handleSubmit(event) {
        event.preventDefault();

        const invoicePayload = {
            driver: driverData,

            load: loadData,

            invoice: {
                ...invoiceData,

                date: invoiceDate
                    ? invoiceDate.format("YYYY/MM/DD")
                    : "",
            },
        };

        console.log("Invoice payload:", invoicePayload);

        alert("فاکتور آماده ارسال به دیتابیس است.");
    }

    return (
        <main className="main-content">

            {/* =====================================================
          PAGE HEADING
      ====================================================== */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <div className="page-back-link">
                        <Link href="/invoices">
                            <ArrowRight size={17} />
                            بازگشت به فاکتورها
                        </Link>
                    </div>

                    <h1>ثبت فاکتور</h1>

                    <p>
                        اطلاعات راننده، بار، هزینه و گیرنده را وارد کنید
                    </p>

                </div>

            </div>

            {/* =====================================================
          FORM PANEL
      ====================================================== */}

            <section className="invoice-form-panel">

                {/* Header */}

                <div className="invoice-form-header">

                    <div className="invoice-form-header-icon">
                        <FileText size={24} />
                    </div>

                    <div>
                        <h2>اطلاعات فاکتور</h2>

                        <p>
                            اطلاعات موردنیاز فاکتور و حواله راننده
                        </p>
                    </div>

                </div>

                <form
                    className="invoice-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
              DRIVER SECTION
          ================================================== */}

                    <div className="invoice-form-section-title">
                        <UserRound size={19} />
                        <span>اطلاعات راننده</span>
                    </div>

                    {/* Driver Search */}

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
                                            setDriverSearch(event.target.value);
                                            setDriverSearchOpen(true);
                                            setSelectedDriver(null);
                                        }}
                                        onFocus={() => setDriverSearchOpen(true)}
                                        placeholder="نام راننده را جستجو کنید..."
                                    />

                                </div>

                                {driverSearchOpen && (
                                    <div className="invoice-search-dropdown">

                                        {filteredDrivers.length > 0 ? (
                                            filteredDrivers.map((driver) => (

                                                <button
                                                    type="button"
                                                    key={driver.id}
                                                    className="invoice-search-option"
                                                    onClick={() => selectDriver(driver)}
                                                >

                                                    <div className="invoice-option-icon">
                                                        <UserRound size={18} />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {driver.name}
                                                        </strong>

                                                        <span>
                                                            {driver.id} - {driver.vehicleType}
                                                        </span>
                                                    </div>

                                                </button>

                                            ))
                                        ) : (
                                            <div className="invoice-search-empty">
                                                راننده‌ای پیدا نشد
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="invoice-manual-button"
                                            onClick={enableManualDriver}
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

                    {/* Driver ID */}

                    <div className="invoice-form-group">

                        <label>
                            Driver ID
                        </label>

                        <div className="invoice-input-wrapper">

                            <UserRound size={18} />

                            <input
                                value={driverData.id}
                                onChange={(event) =>
                                    editDriverField(
                                        "id",
                                        event.target.value
                                    )
                                }
                                placeholder="شناسه راننده"
                                disabled={!!selectedDriver}
                            />

                        </div>

                    </div>

                    {/* Driver Name */}

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

                    {/* National ID */}

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

                    {/* License */}

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

                    {/* Vehicle ID */}

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

                    {/* Vehicle Type */}

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

                    {/* =================================================
              INVOICE INFORMATION
          ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <FileText size={19} />

                        <span>
                            اطلاعات فاکتور
                        </span>



                    </div>

                    {/* Persian Date */}

                    <div className="invoice-form-group">

                        <label>
                            تاریخ <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper invoice-date-wrapper">

                            <CalendarDays size={18} />

                            <PersianDatePicker
                                value={invoiceDate}
                                onChange={setInvoiceDate}
                                placeholder="تاریخ فاکتور را انتخاب کنید"
                            />

                        </div>

                    </div>

                    {/* Start Time */}

                    <div className="invoice-form-group">

                        <label>
                            ساعت شروع
                        </label>

                        <div className="invoice-input-wrapper">

                            <Clock3 size={18} />

                            <input
                                type="time"
                                value={invoiceData.startTime}
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

                    {/* Load Search */}

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
                                            setLoadSearch(event.target.value);
                                            setLoadSearchOpen(true);
                                            setSelectedLoad(null);
                                        }}
                                        onFocus={() => setLoadSearchOpen(true)}
                                        placeholder="عنوان بار را جستجو کنید..."
                                    />

                                </div>

                                {loadSearchOpen && (
                                    <div className="invoice-search-dropdown">

                                        {filteredLoads.length > 0 ? (
                                            filteredLoads.map((load) => (

                                                <button
                                                    type="button"
                                                    key={load.id}
                                                    className="invoice-search-option"
                                                    onClick={() => selectLoad(load)}
                                                >

                                                    <div className="invoice-option-icon">
                                                        <Package size={18} />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {load.title}
                                                        </strong>

                                                        <span>
                                                            {load.companyName} - {load.origin} تا{" "}
                                                            {load.destination}
                                                        </span>

                                                    </div>

                                                </button>

                                            ))
                                        ) : (
                                            <div className="invoice-search-empty">
                                                باری پیدا نشد
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            className="invoice-manual-button"
                                            onClick={enableManualLoad}
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

                    {/* Load ID */}

                    <div className="invoice-form-group">

                        <label>
                            Load ID
                        </label>

                        <div className="invoice-input-wrapper">

                            <Package size={18} />

                            <input
                                value={loadData.id}
                                onChange={(event) =>
                                    editLoadField(
                                        "id",
                                        event.target.value
                                    )
                                }
                                placeholder="شناسه بار"
                                disabled={!!selectedLoad}
                            />

                        </div>

                    </div>

                    {/* Load Title */}

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

                    {/* Bar Type */}

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

                    {/* Company */}

                    <div className="invoice-form-group">

                        <label>
                            نام شرکت
                        </label>

                        <div className="invoice-input-wrapper">

                            <Building2 size={18} />

                            <input
                                value={loadData.companyName}
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

                    {/* Origin */}

                    <div className="invoice-form-group">

                        <label>
                            مبدأ
                        </label>

                        <div className="invoice-input-wrapper">

                            <MapPin size={18} />

                            <input
                                value={loadData.origin}
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

                    {/* Destination */}

                    <div className="invoice-form-group">

                        <label>
                            مقصد
                        </label>

                        <div className="invoice-input-wrapper">

                            <MapPin size={18} />

                            <input
                                value={loadData.destination}
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

                    {/* Distance */}

                    <div className="invoice-form-group">

                        <label>
                            مسافت
                        </label>

                        <div className="invoice-input-wrapper">

                            <Route size={18} />

                            <input
                                value={loadData.distance}
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

                    {/* Address */}

                    <div className="invoice-form-group invoice-form-full">

                        <label>
                            آدرس
                        </label>

                        <div className="invoice-input-wrapper invoice-textarea-wrapper">

                            <MapPin size={18} />

                            <textarea
                                value={loadData.address}
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

                    {/* Main Cost */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه اصلی <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper">

                            <Banknote size={18} />

                            <input
                                type="number"
                                value={invoiceData.cost}
                                onChange={(event) =>
                                    editInvoiceField(
                                        "cost",
                                        event.target.value
                                    )
                                }
                                placeholder="مبلغ هزینه"
                            />

                            <span className="invoice-input-unit">
                                تومان
                            </span>

                        </div>

                    </div>

                    {/* Payment Type */}

                    <div className="invoice-form-group">

                        <label>
                            نوع پرداخت <span>*</span>
                        </label>

                        <div className="invoice-input-wrapper">

                            <Banknote size={18} />

                            <select
                                value={invoiceData.costType}
                                onChange={(event) =>
                                    editInvoiceField(
                                        "costType",
                                        event.target.value
                                    )
                                }
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

                    {/* Insurance */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه بیمه
                        </label>

                        <div className="invoice-input-wrapper">

                            <ShieldCheck size={18} />

                            <input
                                type="number"
                                value={invoiceData.insuranceCost}
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

                    {/* Worker */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه کارگر
                        </label>

                        <div className="invoice-input-wrapper">

                            <HardHat size={18} />

                            <input
                                type="number"
                                value={invoiceData.workerCost}
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

                    {/* Scale */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه باسکول
                        </label>

                        <div className="invoice-input-wrapper">

                            <Scale size={18} />

                            <input
                                type="number"
                                value={invoiceData.scaleCost}
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

                    {/* Stop */}

                    <div className="invoice-form-group">

                        <label>
                            هزینه توقف
                        </label>

                        <div className="invoice-input-wrapper">

                            <CircleStop size={18} />

                            <input
                                type="number"
                                value={invoiceData.stopCost}
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

                    {/* =================================================
              OTHER INFORMATION
          ================================================== */}

                    <div className="invoice-form-section-title invoice-form-full">

                        <FileText size={19} />

                        <span>
                            اطلاعات تکمیلی
                        </span>

                    </div>

                    {/* Receiver */}

                    <div className="invoice-form-group">

                        <label>
                            نام گیرنده
                        </label>

                        <div className="invoice-input-wrapper">

                            <UserCheck size={18} />

                            <input
                                value={invoiceData.receiverName}
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

                    {/* Description */}

                    <div className="invoice-form-group invoice-form-full">

                        <label>
                            توضیحات
                        </label>

                        <div className="invoice-input-wrapper invoice-textarea-wrapper">

                            <FileText size={18} />

                            <textarea
                                rows={4}
                                value={invoiceData.description}
                                onChange={(event) =>
                                    editInvoiceField(
                                        "description",
                                        event.target.value
                                    )
                                }
                                placeholder="توضیحات فاکتور..."
                            />

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
                        >
                            <Save size={19} />
                            <span>ثبت فاکتور</span>
                        </button>

                    </div>

                </form>

            </section>

        </main>
    );
}