"use client";
import { createLocation } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { useCountries } from "@/app/lib/getCountries";
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
import { useState } from "react";
import React from "react";
import { use } from "react";


export default function AddressRoute({ params }: { params: Promise<{ id: string }> }){
    const {getAllCountries} = useCountries();
    const [LocationValue, setLocationValue] = useState("");

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
            <input type="hidden" name="countryValue" value={LocationValue} />
            <div className="w-3/5 mx-auto mb-36">
                <div className="mb-5">
                    <Select required onValueChange={(value) => setLocationValue(value)}>
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
                <LazyMap LocationValue={LocationValue} />
            </div>
             <CreateBottomBar />
        </form>
        </>
    )
    
}