import { useState, useEffect, useCallback } from "react";

/*
Some background...

This custom hook was created to reuse the bus arrival fetching because 
it's needed in both "ArrivalCard" and "Focus".

The hook useArrivalData returns an "arrivalObject" which is a state and
contains the necessary data. It will also self-update on an interval,
defined here.
*/

// create the HTML element to display time until arrival or an error message
export function timeDisplay(nextTime, currentTime) {
    if (nextTime) {
        if (nextTime > currentTime) {
            return <p>{Math.floor((nextTime - currentTime) / 60000)} mins</p>;
        } else {
            return <p>0 mins</p>;
        }
    }
    return <p>No arrival data</p>;
}

export default function useBusArrivalData(serviceNoInFocus, stopInFocus) {
    const [busArrival, setBusArrival] = useState({});

    // this needs to useCallback, otherwise it will cause an infinite loop with useEffect
    const fetchArrivals = useCallback(async (serviceNo, stop) => {
        console.log(`Fetching data for Stop: ${stop}, ServiceNo: ${serviceNo}`);

        const response = await fetch(
            `https://arrivelah2.busrouter.sg/?id=${stop}`
        );
        const myJson = await response.json();

        const arrivalObj = myJson.services.find(
            (service) => service.no === serviceNo
        );

        arrivalObj.next.time = Date.parse(arrivalObj.next.time);

        setBusArrival(arrivalObj);
    }, []);

    // on mount, fetch new arrival data, then setInterval to regularly repeat
    useEffect(() => {
        fetchArrivals(serviceNoInFocus, stopInFocus);
        const intervalId = setInterval(() => {
            // TODO: this should be in try-catch
            // and per LTA's recommendation, if there's no arrival data, then should check whether bus is in operation,
            //      and display a message accordingly ("Not in operation" or "no arrival data" )
            fetchArrivals(serviceNoInFocus, stopInFocus);
        }, 60000);
        return () => clearInterval(intervalId);
    }, [fetchArrivals, serviceNoInFocus, stopInFocus]);

    return busArrival;
}
