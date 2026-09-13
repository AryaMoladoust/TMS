"use client";

import "leaflet/dist/leaflet.css";

import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";

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

export default function DestinationMap({ position, setPosition }) {
    return (
        <MapContainer
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
    );
}