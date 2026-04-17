"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

export default function MapComponent({ theme, scenario, livePos }: { theme: string, scenario: string, livePos?: [number, number] | null }) {
    const isDark = theme === 'dark';
    const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const basePos: [number, number] = livePos || [12.9279, 77.6271];
    const riderPos: [number, number] = scenario === 'fraud' ? [basePos[0] + 0.05, basePos[1] + 0.05] : basePos;

    // Normal = Blue, Disruption/Fraud = Red
    const riskColor = scenario === 'normal' ? '#3b82f6' : '#ef4444';

    return (
        <MapContainer center={basePos} zoom={13} className="w-full h-full rounded-2xl z-0" zoomControl={false}>
            <TileLayer url={tileUrl} attribution="&copy; CartoDB" />
            <MapUpdater center={riderPos} zoom={scenario === 'fraud' ? 11 : 14} />
            <Circle center={basePos} radius={3000} pathOptions={{ color: riskColor, fillColor: riskColor, fillOpacity: 0.15 }} />
            <Marker position={riderPos} />
        </MapContainer>
    );
}