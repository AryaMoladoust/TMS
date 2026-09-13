
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

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


export default function AddLoadPage() {

    // ===============================
    // Map States
    // ===============================

    const [showDestinationMap, setShowDestinationMap] =
        useState(false);

    const [destinationLocation, setDestinationLocation] =
        useState(null);


    // ===============================
    // Submit
    // ===============================

    const handleSubmit = (event) => {

        event.preventDefault();

        console.log("Destination location:", destinationLocation);

        // بعداً اطلاعات فرم را اینجا به API می‌فرستیم
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
                            >

                                <option
                                    value=""
                                    disabled
                                >
                                    شرکت را انتخاب کنید
                                </option>


                                <option value="COM-1001">
                                    شرکت حمل‌ونقل شمال
                                </option>


                                <option value="COM-1002">
                                    صنایع شمال
                                </option>


                                <option value="COM-1003">
                                    بازرگانی گیلان
                                </option>


                                <option value="COM-1004">
                                    شرکت ساختمانی شمال
                                </option>

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
                                placeholder="۳۲۵"
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
