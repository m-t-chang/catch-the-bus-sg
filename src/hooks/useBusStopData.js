/*
Load a single bus stop data object from the global context. 
Handles errors if global context is not populated with data yet.

This is a custom hook because it's reused. It's short, but it's reused.
*/

import { useState, useEffect, useContext } from "react";

import StaticDataContext from "../contexts/StaticDataContext";

export default function useBusStopData(stopInFocus) {
    const staticData = useContext(StaticDataContext);
    const [busStop, setBusStop] = useState({});

    // when staticData loads, get the bus stop data
    useEffect(() => {
        if (staticData.busStops) {
            // console.log(staticData.busStops);
            // console.log(!staticData.busStops);
            setBusStop(
                staticData.busStops.data.find(
                    (stop) => stop.BusStopCode === stopInFocus
                )
            );
        } else {
            setBusStop({});
        }
    }, [staticData, stopInFocus]);

    return busStop;
}
