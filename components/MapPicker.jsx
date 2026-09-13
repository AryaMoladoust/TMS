"use client";

import { useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

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


export default function MapPicker({
    initialPosition = {
        lat: 35.6892,
        lng: 51.389,
    },

    onConfirm,
}) {
    const [position, setPosition] = useState(null);

    const handleConfirm = () => {
        if (!position) return;

        onConfirm(position);
    };

    return (
        <div className="map-picker-container">

            <MapContainer
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
                        برای انتخاب مقصد، روی نقطه موردنظر روی نقشه کلیک کنید
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