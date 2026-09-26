"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ArrowRight,
    Package,
    Building2,
    MapPin,
    Route,
    Truck,
    FileText,
    Save,
    Navigation,
    Tag,
    Map,
    MapPinned,
} from "lucide-react";


// ===============================
// Map Picker
// ===============================

const MapPicker = dynamic(
    () => import("@/components/MapPicker"),
    {
        ssr: false,

        loading: () => (
            <div className="map-loading">
                در حال بارگذاری نقشه...
            </div>
        ),
    }
);


// ===============================
// مختصات ثابت مبدأ
// (آدرس شرکت باربری در رشت)
//
// !! این دو عدد را با مختصات واقعی محل باربری جایگزین کنید.
// ساده‌ترین راه: یک‌بار MapPicker را باز کنید، دقیقاً روی
// محل باربری کلیک کنید و دو عدد «عرض جغرافیایی» و
// «طول جغرافیایی» که پایین نقشه نشان داده می‌شود را همین‌جا قرار دهید.
// ===============================

const ORIGIN_LOCATION = {
    lat: null, // TODO: عرض جغرافیایی واقعی باربری رشت
    lng: null, // TODO: طول جغرافیایی واقعی باربری رشت
};

function hasValidOrigin() {
    return (
        typeof ORIGIN_LOCATION.lat === "number" &&
        typeof ORIGIN_LOCATION.lng === "number"
    );
}


export default function AddLoadPage() {

    const router = useRouter();


    // ===============================
    // Map States
    // ===============================

    const [showDestinationMap, setShowDestinationMap] =
        useState(false);

    const [destinationLocation, setDestinationLocation] =
        useState(null);


    // ===============================
    // Distance (real-time road distance)
    // ===============================

    const [distance, setDistance] = useState("");
    const [distanceLoading, setDistanceLoading] = useState(false);
    const [distanceError, setDistanceError] = useState("");


    useEffect(() => {

        if (!destinationLocation) {
            return;
        }

        if (!hasValidOrigin()) {
            setDistanceError(
                "مختصات مبدأ هنوز در کد تنظیم نشده است."
            );
            return;
        }

        let cancelled = false;

        async function calculateRoadDistance() {

            try {

                setDistanceLoading(true);
                setDistanceError("");

                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${ORIGIN_LOCATION.lng},${ORIGIN_LOCATION.lat};` +
                    `${destinationLocation.lng},${destinationLocation.lat}` +
                    `?overview=false`;

                const response = await fetch(url);

                const data = await response.json();

                if (
                    !response.ok ||
                    data.code !== "Ok" ||
                    !data.routes?.[0]
                ) {
                    throw new Error("مسیر پیدا نشد");
                }

                const meters = data.routes[0].distance;
                const kilometers = Math.round(meters / 1000);

                if (!cancelled) {
                    setDistance(String(kilometers));
                }

            } catch (error) {

                console.error(
                    "Distance calculation error:",
                    error
                );

                if (!cancelled) {
                    setDistanceError(
                        "محاسبه خودکار مسافت ممکن نشد؛ می‌توانید مسافت را دستی وارد کنید."
                    );
                }

            } finally {

                if (!cancelled) {
                    setDistanceLoading(false);
                }

            }

        }

        calculateRoadDistance();

        return () => {
            cancelled = true;
        };

    }, [destinationLocation]);


    // ===============================
    // Companies
    // ===============================

    const [companies, setCompanies] = useState([]);

    const [companiesLoading, setCompaniesLoading] =
        useState(true);


    useEffect(() => {

        async function fetchCompanies() {

            try {

                setCompaniesLoading(true);

                const response = await fetch(
                    "/api/companies",
                    {
                        cache: "no-store",
                    }
                );

                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        result.error ||
                        "خطا در دریافت شرکت‌ها"
                    );

                }


                const companyList =
                    Array.isArray(result)
                        ? result
                        : Array.isArray(result.companies)
                            ? result.companies
                            : [];


                setCompanies(companyList);

            } catch (error) {

                console.error(
                    "Fetch companies error:",
                    error
                );

                setCompanies([]);

                alert(
                    "خطا در دریافت لیست شرکت‌ها"
                );

            } finally {

                setCompaniesLoading(false);

            }

        }


        fetchCompanies();

    }, []);


    // ===============================
    // Submit
    // ===============================


    const handleSubmit = async (event) => {

        event.preventDefault();


        // قبل از await فرم را ذخیره می‌کنیم

        const form = event.currentTarget;

        const formData = new FormData(form);


        // =================================
        // نام شرکت انتخاب شده
        // =================================

        const companySelect =
            form.elements.loadCompany;


        const companyName =
            companySelect.options[
                companySelect.selectedIndex
            ]?.text || "";


        if (!companySelect.value) {

            alert(
                "لطفاً شرکت را انتخاب کنید."
            );

            return;

        }


        // =================================
        // اطلاعات بار
        // =================================

        const loadData = {

            title:
                formData.get("loadTitle"),

            companyName,

            barType:
                formData.get("loadType"),

            origin:
                formData.get("loadOrigin"),

            destination:
                formData.get("loadDestination"),

            destinationLocation:
                destinationLocation
                    ? {
                        lat:
                            destinationLocation.lat,

                        lng:
                            destinationLocation.lng,
                    }
                    : null,

            address:
                formData.get("loadAddress"),

            distance:
                Number(
                    formData.get(
                        "loadDistance"
                    )
                ),

            provinceStatus:
                formData.get(
                    "loadProvinceStatus"
                ),

            vehicleType:
                formData.get(
                    "loadVehicleType"
                ),

            description:
                formData.get(
                    "loadDescription"
                ),

        };


        // =================================
        // ارسال به API
        // =================================

        try {

            const response =
                await fetch(
                    "/api/loads",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                loadData
                            ),
                    }
                );


            const result =
                await response.json();


            // =================================
            // خطا
            // =================================

            if (!response.ok) {

                console.error(
                    "API Error:",
                    result
                );


                alert(
                    result.message ||
                    result.error ||
                    "خطا در ثبت بار"
                );


                return;

            }


            // =================================
            // موفقیت
            // =================================

            console.log(
                "Load created:",
                result
            );


            alert(
                `بار با موفقیت ثبت شد.\nشناسه بار: ${result.loadId}`
            );


            // =================================
            // بازگشت به صفحه اصلی بارها
            // =================================

            router.push("/loads");

            router.refresh();


        } catch (error) {

            console.error(
                "Submit error:",
                error
            );


            alert(
                "ثبت بار انجام نشد."
            );

        }

    };


    return (

        <main className="main-content">


            {/* =====================================
                Page Header
            ====================================== */}

            <div className="page-heading page-heading-with-action">

                <div>

                    <div className="page-back-link">

                        <Link href="/loads">

                            <ArrowRight size={17} />

                            بازگشت به بارها

                        </Link>

                    </div>


                    <h1>
                        افزودن بار
                    </h1>


                    <p>
                        اطلاعات بار جدید را وارد کنید
                    </p>

                </div>

            </div>


            {/* =====================================
                Form Panel
            ====================================== */}

            <section className="load-form-panel">


                {/* =================================
                    Form Header
                ================================== */}

                <div className="load-form-header">

                    <div className="load-form-header-icon">

                        <Package size={24} />

                    </div>


                    <div>

                        <h2>
                            اطلاعات بار
                        </h2>


                        <p>
                            اطلاعات شرکت، نوع بار، مسیر و مشخصات حمل را وارد کنید
                        </p>

                    </div>

                </div>


                {/* =================================
                    Form
                ================================== */}

                <form
                    className="load-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        عنوان بار
                    ================================== */}

                    <div className="load-form-group load-form-full">

                        <label htmlFor="loadTitle">

                            عنوان بار <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Tag size={18} />


                            <input
                                id="loadTitle"
                                name="loadTitle"
                                type="text"
                                placeholder="مثلاً بار مواد غذایی رشت به تهران"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        شرکت
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadCompany">

                            شرکت <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Building2 size={18} />


                            <select
                                id="loadCompany"
                                name="loadCompany"
                                defaultValue=""
                                disabled={companiesLoading}
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >

                                    {companiesLoading
                                        ? "در حال دریافت شرکت‌ها..."
                                        : "شرکت را انتخاب کنید"}

                                </option>


                                {!companiesLoading &&
                                    companies.map(
                                        (company) => (

                                            <option
                                                key={company._id}
                                                value={company._id}
                                            >

                                                {company.name}

                                            </option>

                                        )
                                    )}

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        نوع بار
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadType">

                            نوع بار <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Package size={18} />


                            <select
                                id="loadType"
                                name="loadType"
                                defaultValue=""
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >

                                    نوع بار را انتخاب کنید

                                </option>


                                <option value="food">
                                    مواد غذایی
                                </option>


                                <option value="industrial">
                                    قطعات صنعتی
                                </option>


                                <option value="construction">
                                    مصالح ساختمانی
                                </option>


                                <option value="agriculture">
                                    محصولات کشاورزی
                                </option>


                                <option value="other">
                                    سایر
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        مسیر بار
                    ================================== */}

                    <div className="load-form-section-title load-form-full">

                        <MapPin size={19} />

                        <span>
                            مسیر بار
                        </span>

                    </div>


                    {/* =================================
                        مبدأ
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadOrigin">

                            مبدأ <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <MapPin size={18} />


                            <input
                                id="loadOrigin"
                                name="loadOrigin"
                                type="text"
                                placeholder="رشت"
                                defaultValue="رشت"
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        مقصد
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadDestination">

                            مقصد <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Navigation size={18} />


                            <input
                                id="loadDestination"
                                name="loadDestination"
                                type="text"
                                placeholder="تهران"
                                required
                            />

                        </div>


                        {/* =================================
                            انتخاب مقصد روی نقشه
                        ================================== */}

                        <button
                            type="button"
                            className="map-select-button"
                            onClick={() =>
                                setShowDestinationMap(true)
                            }
                        >

                            <Map size={17} />

                            {destinationLocation
                                ? "تغییر محل مقصد روی نقشه"
                                : "انتخاب مقصد روی نقشه"}

                        </button>


                        {/* =================================
                            نمایش مقصد انتخاب شده
                        ================================== */}

                        {destinationLocation && (

                            <div className="destination-selected">

                                <MapPin size={17} />


                                <div>

                                    <strong>
                                        مقصد روی نقشه انتخاب شد
                                    </strong>


                                    <span>

                                        {destinationLocation.lat.toFixed(6)}

                                        {" , "}

                                        {destinationLocation.lng.toFixed(6)}

                                    </span>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        نقشه مقصد
                    ================================== */}

                    {showDestinationMap && (

                        <div className="load-map-section load-form-full">


                            {/* Header نقشه */}

                            <div className="map-section-header">

                                <div>

                                    <MapPin size={19} />

                                    <strong>
                                        انتخاب محل دقیق مقصد
                                    </strong>

                                </div>


                                <span>
                                    روی محل دقیق مقصد کلیک کنید
                                </span>

                            </div>


                            {/* Map */}

                            <MapPicker

                                initialPosition={{
                                    lat: 35.6892,
                                    lng: 51.3890,
                                }}


                                onConfirm={(location) => {

                                    setDestinationLocation(
                                        location
                                    );


                                    setShowDestinationMap(
                                        false
                                    );

                                }}

                            />

                        </div>

                    )}


                    {/* =================================
                        آدرس بار
                    ================================== */}

                    <div className="load-form-group load-form-full">

                        <label htmlFor="loadAddress">

                            آدرس بار <span>*</span>

                        </label>


                        <div className="load-input-wrapper load-textarea-wrapper">

                            <MapPin size={18} />


                            <textarea
                                id="loadAddress"
                                name="loadAddress"
                                rows={3}
                                placeholder="آدرس دقیق محل را وارد کنید..."
                                required
                            />

                        </div>

                    </div>


                    {/* =================================
                        مسافت
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadDistance">

                            مسافت <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Route size={18} />


                            <input
                                id="loadDistance"
                                name="loadDistance"
                                type="number"
                                min="0"
                                value={distance}
                                onChange={(event) =>
                                    setDistance(event.target.value)
                                }
                                placeholder="۳۲۵"
                                required
                            />


                            <span className="load-input-unit">

                                کیلومتر

                            </span>

                        </div>


                        {/*
                            وضعیت محاسبه‌ی خودکار مسافت
                            (فقط پس از انتخاب مقصد روی نقشه فعال می‌شود)
                        */}

                        {distanceLoading && (

                            <div
                                style={{
                                    fontSize: "12px",
                                    color: "#64748b",
                                    marginTop: "6px",
                                }}
                            >
                                در حال محاسبه مسافت جاده‌ای...
                            </div>

                        )}

                        {!distanceLoading &&
                            distanceError && (

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#b91c1c",
                                        marginTop: "6px",
                                    }}
                                >
                                    {distanceError}
                                </div>

                            )}

                        {!distanceLoading &&
                            !distanceError &&
                            distance &&
                            destinationLocation && (

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#15803d",
                                        marginTop: "6px",
                                    }}
                                >
                                    مسافت جاده‌ای به‌صورت خودکار محاسبه شد: {distance} کیلومتر
                                </div>

                            )}

                    </div>


                    {/* =================================
                        وضعیت مسیر
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="loadProvinceStatus">

                            وضعیت مسیر <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <MapPin size={18} />


                            <select
                                id="loadProvinceStatus"
                                name="loadProvinceStatus"
                                defaultValue=""
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >

                                    وضعیت مسیر را انتخاب کنید

                                </option>


                                <option value="inside">
                                    داخل استان
                                </option>


                                <option value="outside">
                                    خارج استان
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        نوع خودرو
                    ================================== */}

                    <div className="load-form-section-title load-form-full">

                        <Truck size={19} />

                        <span>
                            نوع خودرو
                        </span>

                    </div>


                    <div className="load-form-group">

                        <label htmlFor="loadVehicleType">

                            نوع خودرو <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Truck size={18} />


                            <select
                                id="loadVehicleType"
                                name="loadVehicleType"
                                defaultValue=""
                                required
                            >

                                <option
                                    value=""
                                    disabled
                                >

                                    نوع خودرو را انتخاب کنید

                                </option>


                                <option value="truck">
                                    کامیون
                                </option>


                                <option value="trailer">
                                    تریلی
                                </option>


                                <option value="pickup">
                                    نیسان
                                </option>


                                <option value="van">
                                    وانت
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        توضیحات
                    ================================== */}

                    <div className="load-form-section-title load-form-full">

                        <FileText size={19} />

                        <span>
                            توضیحات
                        </span>

                    </div>


                    <div className="load-form-group load-form-full">

                        <label htmlFor="loadDescription">

                            توضیحات بار

                        </label>


                        <div className="load-input-wrapper load-textarea-wrapper">

                            <FileText size={18} />


                            <textarea
                                id="loadDescription"
                                name="loadDescription"
                                rows={4}
                                placeholder="توضیحات اضافی درباره بار..."
                            />

                        </div>

                    </div>


                    {/* =================================
                        Buttons
                    ================================== */}

                    <div className="load-form-actions">


                        <Link
                            href="/loads"
                            className="load-cancel-button"
                        >

                            انصراف

                        </Link>


                        <button
                            type="submit"
                            className="primary-action-button"
                        >

                            <Save size={19} />

                            <span>
                                ذخیره بار
                            </span>

                        </button>

                    </div>

                </form>

            </section>

        </main>

    );
}
