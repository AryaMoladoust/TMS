"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { Search, Loader2, X } from "lucide-react";

// رفع مشکل نمایش نشدن آیکون مارکر در Next.js
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// کامپوننت داخلی که کلیک روی نقشه رو مدیریت می‌کنه
function ClickMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
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
            className="location-search-box"
            style={{ position: "relative", marginBottom: "10px" }}
        >

            <div
                className="location-search-input-wrapper"
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
                    className="location-search-results"
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

export default function DestinationMap({ position, setPosition }) {
    const mapRef = useRef(null);

    function handleSearchSelect(result) {
        setPosition({ lat: result.lat, lng: result.lng });

        if (mapRef.current) {
            mapRef.current.setView([result.lat, result.lng], 14);
        }
    }

    return (
        <div className="destination-map-wrapper">

            <LocationSearchBox onSelect={handleSearchSelect} />

            <MapContainer
                ref={mapRef}
                center={
                    position
                        ? [position.lat, position.lng]
                        : [35.6892, 51.389]
                }
                zoom={position ? 12 : 6}
                style={{
                    width: "100%",
                    height: "420px",
                    borderRadius: "8px",
                }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />

                <ClickMarker position={position} setPosition={setPosition} />

            </MapContainer>

        </div>
    );
}
