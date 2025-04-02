"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

interface HomeMapProps {
    locationValue: string;
    latitude?: number | null;
    longitude?: number | null;
}

export function HomeMap({ locationValue, latitude, longitude }: HomeMapProps) {
    const LazyMap = dynamic(() => import("@/app/components/map"), {
        ssr: false,
        loading: () => <Skeleton className="h-[50vh] w-full" />,
    });

    return <LazyMap 
        LocationValue={locationValue} 
        latitude={latitude} 
        longitude={longitude}
    />;
}

