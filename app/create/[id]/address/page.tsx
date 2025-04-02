"use client";
import { createLocation } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { useCountries } from "@/app/lib/getCountries"; // No longer needed
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectLabel, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import React from "react";
import { use } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';


const ICON = icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3446/3446293.png',
    iconSize: [30, 30],
  });
  
  
  function LocationPicker({ setLatitude, setLongitude }: { setLatitude: (lat: number) => void, setLongitude: (lng: number) => void }) {
    useMapEvents({
      click: (e) => {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
    return null;
  }

export default function AddressRoute({ params }: { params: Promise<{ id: string }> }){
    const {getAllCountries} = useCountries(); //No longer needed
    const [countryValue, setCountryValue] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
 
  const selectedCountry = getAllCountries().find(country => country.value === countryValue);
  const initialCenter = selectedCountry?.latlang || [52.505, -0.09]; // Default center if no country selected


    const LazyMap = dynamic(() => import("@/app/components/map"), {
        ssr: false,
        loading: () => <Skeleton className="w-full h-[50vh]" />

    });
    const unwrappedparams = use(params); // Unwrap the `params` Promise


    return (
        <>
        <div className="w-3/5 mx-auto">
            <h2 className="text-3xt 
            font-semibold 
            tracking-tight 
            transition-colors
             mb-10">
                Where is your Hostel located
            </h2>
        </div>
        <form action={createLocation}>
            <input type="hidden" name="hostelId" value={unwrappedparams.id} />
            <input type="hidden" name="countryValue" value={countryValue} />
      {/* Hidden inputs for latitude and longitude */}
         <input
          type="hidden"
          name="latitude"
          value={latitude ?? ''}
        />
        <input
          type="hidden"
          name="longitude"
          value={longitude ?? ''} 
        />
            <div className="w-3/5 mx-auto mb-36">
                  <div className="mb-5">
          <Select required onValueChange={(value) => {
            setCountryValue(value);
            // Optionally reset latitude and longitude when country changes
            setLatitude(null);
            setLongitude(null);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  Countries
                </SelectLabel>
                {getAllCountries().map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.flag} {item.label} / {item.region}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* Map component for selecting precise location */}
        <div className="h-[50vh] rounded-lg relative z-0">
          <MapContainer
            center={initialCenter}
            zoom={selectedCountry ? 6 : 2}
            scrollWheelZoom={false}
            className="h-full w-full rounded-lg"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {latitude !== null && longitude !== null && (
              <Marker position={[latitude, longitude]} icon={ICON} />
            )}
            {/* Component to handle map clicks */}
            <LocationPicker setLatitude={setLatitude} setLongitude={setLongitude} />
          </MapContainer>
          {latitude && longitude && (
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-sm">
              <span className="font-semibold text-green-600">Location Selected ✓</span><br/>
              Latitude: {latitude.toFixed(5)}, Longitude: {longitude.toFixed(5)}
              <div className="mt-1 text-xs text-gray-500">Click elsewhere on the map to adjust location</div>
            </div>
          )}
          {!latitude && !longitude && countryValue && (
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-sm">
              <span className="font-semibold text-amber-600">Location Required</span><br/>
              Please click on the map to select the precise hostel location.
            </div>
          )}
          {!countryValue && (
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow-md text-sm">
              <span className="font-semibold text-amber-600">Country Required</span><br/>
              Please select a country first before marking location.
            </div>
          )}
        </div>
      </div>
       <CreateBottomBar 
          disableSubmit={!latitude || !longitude} 
          disableMessage={!latitude || !longitude ? "Please select a location on the map" : undefined} 
        />
    </form>
    </>
  )

}