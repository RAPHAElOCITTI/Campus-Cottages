"use client";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { DateRange } from 'react-date-range';
import { ChangeEvent, useState } from "react";
import { eachDayOfInterval } from "date-fns";


export function SelectCalendar( {
    booking,
}: {
    booking: {
        startDate: Date;
        endDate: Date;

} []
    | undefined;
} ) {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
    },
]);

let disabledDates: Date[] = [];
booking?.forEach((bookingItem) => {
    const dateRange = eachDayOfInterval({
        start: new Date(bookingItem.startDate),
        end: new Date(bookingItem.endDate),
        
    });

    disabledDates = [...disabledDates, ...dateRange];
})

 

    return (
        <>
        <input type="hidden" name="startDate" value={state[0].startDate.toString()}/>
        <input type="hidden" name="endDate" value={state[0].endDate.toString()}/>
        <DateRange 
            date={new Date()}
            showDateDisplay={false}
            rangeColors={["#526CDE"]}
            ranges={state}
            onChange={(item) => setState([item.selection] as any)}
            minDate={new Date()}
            direction="vertical"
            disabledDates={disabledDates}
        />
        </>
    );
};


