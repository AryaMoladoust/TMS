"use client";

import { useEffect, useRef, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2, X } from "lucide-react";

const markerIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});


function LocationSelector({ position, setPosition }) {
    useMapEvents({
        click(event) {
            setPosition({
                lat: event.latlng.lat,
                lng: event.latlng.lng,
            });
        },
    });

    if (!position) {
        return null;
    }

    return (
        <Marker
            position={[position.lat, position.lng]}
            icon={markerIcon}
        />
    );
}


// =====================================================
// جستجوی مکان
// (Nominatim - سرویس رایگان گروه OpenStreetMap)
// =====================================================

function LocationSearchBox({ onSelect }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!query.trim()) {
            setResults([]);
            setLoading(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true);

                const url =
                    `https://nominatim.openstreetmap.org/search?format=json` +
                    `&q=${encodeURIComponent(query)}` +
                    `&limit=6&accept-language=fa&countrycodes=ir`;

                const response = await fetch(url);
                const data = await response.json();

                setResults(Array.isArray(data) ? data : []);
                setOpen(true);
            } catch (error) {
                console.error("Location search error:", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    function handleSelect(result) {
        onSelect({
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon),
        });

        setQuery(result.display_name);
        setResults([]);
        setOpen(false);
    }

    function handleClear() {
        setQuery("");
        setResults([]);
        setOpen(false);
    }

    return (
        <div
            className="map-picker-search"
            style={{ position: "relative", marginBottom: "10px" }}
        >

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    background: "#fff",
                }}
            >

                <Search size={18} />

                <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setOpen(true);
                    }}
                    placeholder="جستجوی شهر، خیابان یا مکان..."
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        fontSize: "14px",
                    }}
                />

                {loading && (
                    <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                    />
                )}

                {!loading && query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        aria-label="پاک کردن"
                        style={{
                            display: "flex",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            color: "#94a3b8",
                        }}
                    >
                        <X size={16} />
                    </button>
                )}

            </div>

            {open && results.length > 0 && (

                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                        maxHeight: "260px",
                        overflowY: "auto",
                        zIndex: 1000,
                    }}
                >

                    {results.map((result) => (
                        <button
                            type="button"
                            key={result.place_id}
                            onClick={() => handleSelect(result)}
                            style={{
                                display: "block",
                                width: "100%",
                                textAlign: "right",
                                padding: "10px 12px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "13px",
                                borderBottom: "1px solid #f1f5f9",
                            }}
                        >
                            {result.display_name}
                        </button>
                    ))}

                </div>

            )}

            {open && !loading && query.trim() && results.length === 0 && (

                <div
                    style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        left: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#94a3b8",
                        zIndex: 1000,
                    }}
                >
                    نتیجه‌ای پیدا نشد
                </div>

            )}

        </div>
    );
}


export default function MapPicker({
    initialPosition = {
        lat: 35.6892,
        lng: 51.389,
    },

    onConfirm,
}) {
    const [position, setPosition] = useState(null);

    const mapRef = useRef(null);

    const handleConfirm = () => {
        if (!position) return;

        onConfirm(position);
    };

    function handleSearchSelect(result) {
        setPosition(result);

        if (mapRef.current) {
            mapRef.current.setView(
                [result.lat, result.lng],
                14
            );
        }
    }

    return (
        <div className="map-picker-container">

            <LocationSearchBox onSelect={handleSearchSelect} />

            <MapContainer
                ref={mapRef}
                center={[
                    initialPosition.lat,
                    initialPosition.lng,
                ]}
                zoom={7}
                scrollWheelZoom={true}
                className="load-map"
            >

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <LocationSelector
                    position={position}
                    setPosition={setPosition}
                />

            </MapContainer>


            {/* پایین نقشه */}

            <div className="map-picker-footer">

                {position ? (
                    <div className="map-selected-info">

                        <div>
                            <span>عرض جغرافیایی</span>

                            <strong>
                                {position.lat.toFixed(6)}
                            </strong>
                        </div>

                        <div>
                            <span>طول جغرافیایی</span>

                            <strong>
                                {position.lng.toFixed(6)}
                            </strong>
                        </div>

                    </div>
                ) : (
                    <p className="map-hint">
                        برای انتخاب مقصد، از سرچ بالای نقشه استفاده کنید یا روی نقطه موردنظر روی نقشه کلیک کنید
                    </p>
                )}


                <button
                    type="button"
                    className="map-confirm-button"
                    disabled={!position}
                    onClick={handleConfirm}
                >
                    تأیید موقعیت
                </button>

            </div>

        </div>
    );
}
