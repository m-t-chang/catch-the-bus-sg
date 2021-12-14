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
