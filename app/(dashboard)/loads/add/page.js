"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";

import {
    getProvincesList,
    getCities,
} from "@code-plate/iran-cities";


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
// مبدأ ثابت
// ===============================

const ORIGIN_PROVINCE = "گیلان";
const ORIGIN_CITY = "رشت";


// ===============================
// مختصات مبدأ رشت
// ===============================

const ORIGIN_LOCATION = {
    lat: 37.2309875,
    lng: 49.5533906,
};


export default function AddLoadPage() {

    const router = useRouter();


    // ===============================
    // استان‌ها
    // ===============================

    const provinces = useMemo(
        () => getProvincesList(),
        []
    );


    // ===============================
    // مقصد
    // ===============================

    const [destinationProvince, setDestinationProvince] =
        useState("");

    const [destinationCity, setDestinationCity] =
        useState("");


    const destinationCities = useMemo(() => {

        if (!destinationProvince) {
            return [];
        }

        return getCities(destinationProvince);

    }, [destinationProvince]);


    // ===============================
    // Map States
    // ===============================

    const [showDestinationMap, setShowDestinationMap] =
        useState(false);

    const [destinationLocation, setDestinationLocation] =
        useState(null);


    // ===============================
    // Distance
    // ===============================

    const [calculatedDistance, setCalculatedDistance] =
        useState("");


    const [distanceLoading, setDistanceLoading] =
        useState(false);


    // ===============================
    // Companies
    // ===============================

    const [companies, setCompanies] = useState([]);

    const [companiesLoading, setCompaniesLoading] =
        useState(true);


    // ===============================
    // دریافت شرکت‌ها
    // ===============================

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
    // تغییر استان مقصد
    // ===============================

    function handleDestinationProvinceChange(
        event
    ) {

        const province =
            event.target.value;

        setDestinationProvince(
            province
        );

        // با تغییر استان،
        // شهر قبلی باید پاک شود
        setDestinationCity("");

        // مختصات مقصد قبلی هم دیگر معتبر نیست
        setDestinationLocation(null);

        setCalculatedDistance("");

    }


    // ===============================
    // تغییر شهر مقصد
    // ===============================

    function handleDestinationCityChange(
        event
    ) {

        const city =
            event.target.value;

        setDestinationCity(city);

    }


    // ===============================
    // محاسبه مسافت از رشت
    // ===============================

    useEffect(() => {

        if (!destinationLocation) {

            setCalculatedDistance("");

            return;
        }

        let cancelled = false;

        async function calculateDistance() {

            try {

                setDistanceLoading(true);

                const {
                    lat,
                    lng,
                } = destinationLocation;


                const url =
                    `https://router.project-osrm.org/route/v1/driving/` +
                    `${ORIGIN_LOCATION.lng},${ORIGIN_LOCATION.lat};` +
                    `${lng},${lat}` +
                    `?overview=false`;


                const response =
                    await fetch(url);


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.routes ||
                    !data.routes.length
                ) {

                    throw new Error(
                        "مسافت پیدا نشد."
                    );
                }


                const distanceKm =
                    Math.round(
                        data.routes[0].distance /
                        1000
                    );


                if (!cancelled) {

                    setCalculatedDistance(
                        String(distanceKm)
                    );

                }

            } catch (error) {

                console.error(
                    "Distance calculation error:",
                    error
                );

                if (!cancelled) {

                    setCalculatedDistance("");

                }

            } finally {

                if (!cancelled) {

                    setDistanceLoading(false);

                }

            }
        }


        calculateDistance();


        return () => {

            cancelled = true;

        };

    }, [destinationLocation]);


    // ===============================
    // Submit
    // ===============================

    const handleSubmit = async (event) => {

        event.preventDefault();


        const form =
            event.currentTarget;


        const formData =
            new FormData(form);


        // =================================
        // شرکت
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
        // بررسی مقصد
        // =================================

        if (!destinationProvince) {

            alert(
                "لطفاً استان مقصد را انتخاب کنید."
            );

            return;
        }


        if (!destinationCity) {

            alert(
                "لطفاً شهر مقصد را انتخاب کنید."
            );

            return;
        }


        // =================================
        // فاصله
        // =================================

        const distanceValue =
            calculatedDistance ||
            formData.get(
                "loadDistance"
            );


        // =================================
        // اطلاعات بار
        // =================================

        const loadData = {

            title:
                formData.get(
                    "loadTitle"
                ),

            companyName,

            barType:
                formData.get(
                    "loadType"
                ),


            // =============================
            // مبدأ ثابت
            // =============================

            originProvince:
                ORIGIN_PROVINCE,

            originCity:
                ORIGIN_CITY,

            origin:
                ORIGIN_CITY,


            // =============================
            // مقصد استاندارد
            // =============================

            destinationProvince:
                destinationProvince,

            destinationCity:
                destinationCity,

            destination:
                destinationCity,


            // =============================
            // مختصات
            // =============================

            destinationLocation:
                destinationLocation
                    ? {
                        lat:
                            destinationLocation.lat,

                        lng:
                            destinationLocation.lng,
                    }
                    : null,


            // =============================
            // اطلاعات دیگر
            // =============================

            address:
                formData.get(
                    "loadAddress"
                ),

            distance:
                Number(distanceValue || 0),

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
        // ارسال API
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


            router.push(
                "/loads"
            );

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
                                disabled={
                                    companiesLoading
                                }
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
                                                key={
                                                    company._id
                                                }
                                                value={
                                                    company._id
                                                }
                                            >
                                                {
                                                    company.name
                                                }
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

                        <label>
                            مبدأ
                        </label>


                        <div className="load-input-wrapper">

                            <MapPin size={18} />


                            <input
                                type="text"
                                value="رشت، گیلان"
                                disabled
                                readOnly
                            />

                        </div>

                    </div>


                    {/* =================================
                        استان مقصد
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="destinationProvince">

                            استان مقصد <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <MapPin size={18} />


                            <select
                                id="destinationProvince"
                                value={
                                    destinationProvince
                                }
                                onChange={
                                    handleDestinationProvinceChange
                                }
                                required
                            >

                                <option value="">
                                    استان مقصد را انتخاب کنید
                                </option>


                                {provinces.map(
                                    (province) => (

                                        <option
                                            key={
                                                province.en
                                            }
                                            value={
                                                province.en
                                            }
                                        >
                                            {
                                                province.fa
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        شهر مقصد
                    ================================== */}

                    <div className="load-form-group">

                        <label htmlFor="destinationCity">

                            شهر مقصد <span>*</span>

                        </label>


                        <div className="load-input-wrapper">

                            <Navigation size={18} />


                            <select
                                id="destinationCity"
                                value={
                                    destinationCity
                                }
                                onChange={
                                    handleDestinationCityChange
                                }
                                disabled={
                                    !destinationProvince
                                }
                                required
                            >

                                <option value="">
                                    {!destinationProvince
                                        ? "ابتدا استان را انتخاب کنید"
                                        : "شهر مقصد را انتخاب کنید"}
                                </option>


                                {destinationCities.map(
                                    (city) => (

                                        <option
                                            key={
                                                city.en
                                            }
                                            value={
                                                city.fa
                                            }
                                        >
                                            {
                                                city.fa
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                    </div>


                    {/* =================================
                        نقشه مقصد
                    ================================== */}

                    <div className="load-form-group load-form-full">

                        <button
                            type="button"
                            className="map-select-button"
                            onClick={() =>
                                setShowDestinationMap(
                                    true
                                )
                            }
                        >

                            <Map size={17} />

                            {destinationLocation
                                ? "تغییر محل دقیق مقصد روی نقشه"
                                : "انتخاب محل دقیق مقصد روی نقشه"}

                        </button>


                        {destinationLocation && (

                            <div className="destination-selected">

                                <MapPin size={17} />


                                <div>

                                    <strong>
                                        مقصد روی نقشه انتخاب شد
                                    </strong>


                                    <span>

                                        {
                                            destinationLocation.lat.toFixed(
                                                6
                                            )
                                        }

                                        {" , "}

                                        {
                                            destinationLocation.lng.toFixed(
                                                6
                                            )
                                        }

                                    </span>

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================
                        نقشه
                    ================================== */}

                    {showDestinationMap && (

                        <div className="load-map-section load-form-full">

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


                            <MapPicker

                                initialPosition={{
                                    lat: 35.6892,
                                    lng: 51.3890,
                                }}


                                onConfirm={(
                                    location
                                ) => {

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
                                placeholder="آدرس دقیق محل بار را وارد کنید..."
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
                                value={
                                    calculatedDistance
                                }
                                onChange={() => {}}
                                placeholder={
                                    distanceLoading
                                        ? "در حال محاسبه..."
                                        : "بعد از انتخاب مقصد روی نقشه محاسبه می‌شود"
                                }
                                readOnly
                                required
                            />


                            <span className="load-input-unit">
                                کیلومتر
                            </span>

                        </div>

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
                            disabled={
                                distanceLoading
                            }
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