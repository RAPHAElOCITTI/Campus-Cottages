"use client";
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useCountries } from '../lib/getCountries';
import { icon } from 'leaflet';

const ICON = icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3446/3446293.png',
    iconSize: [50, 50],
});  

interface MapProps {
    LocationValue: string;
    latitude?: number | null;
    longitude?: number | null;
}

export default function Map({ LocationValue, latitude, longitude }: MapProps) {
    const { getCountryByValue } = useCountries();
    const countryLatlng = getCountryByValue(LocationValue)?.latlang;
    
    // Use precise coordinates if available, otherwise fall back to country coordinates
    const hasExactLocation = latitude !== undefined && latitude !== null && 
                            longitude !== undefined && longitude !== null;
    
    const center = hasExactLocation 
        ? [latitude, longitude] as [number, number] 
        : (countryLatlng ?? [52.505, -0.09]);
    
    // Use higher zoom when we have exact coordinates
    const zoomLevel = hasExactLocation ? 15 : 8;
    
    return (
        <MapContainer 
            scrollWheelZoom={false} 
            className="h-[50vh] rounded-lg relatives z-0"
            center={center}
            zoom={zoomLevel}
        >
            <TileLayer  
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            />
            <Marker position={center} icon={ICON} />
        </MapContainer>
    );
}