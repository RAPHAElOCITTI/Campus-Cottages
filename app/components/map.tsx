"use client";
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useCountries } from '../lib/getCountries';
import { icon } from 'leaflet';

const ICON = icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3446/3446293.png',
    iconSize: [50, 50],
});  

export default function Map({LocationValue}: { LocationValue: string}) {
    const {getCountryByValue} = useCountries()
    const latlang = getCountryByValue(LocationValue)?.latlang
    return (
        <MapContainer 
        scrollWheelZoom={false} 
        className="h-[50vh] rounded-lg relatives z-0"
        center={latlang ?? [52.505, -0.09]}
        zoom={8}
        >
            <TileLayer  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
    />
    <Marker position={latlang ?? [52.505, -0.09]} icon={ICON} />
        </MapContainer>

    );
}