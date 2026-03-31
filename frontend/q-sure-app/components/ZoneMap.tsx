import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function ZoneMap({ isDisrupted = false }) {
    // Coordinates for Bengaluru (e.g., HSR Layout area)
    const position: [number, number] = [12.9141, 77.6361];
    const color = isDisrupted ? '#f97316' : '#3b82f6'; // Orange for disruption, Blue for normal

    return (
        <div className="h-48 w-full rounded-2xl overflow-hidden border border-gray-200 z-0">
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                dragging={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                <Circle
                    center={position}
                    radius={3000}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.2, weight: 2 }}
                />
            </MapContainer>
        </div>
    );
}