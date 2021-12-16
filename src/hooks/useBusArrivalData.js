/*
Some background...

This custom hook was created to reuse the bus arrival fetching because 
it's needed in both "ArrivalCard" and "Focus".

The hook useArrivalData returns an "arrivalObject" which is a state and
contains the necessary data. It will also self-update on an interval,
defined here.
*/

import { useState, useEffect, useCallback } from "react";
import { Grid, Typography } from "@mui/material";

// create the HTML element to display time until arrival or an error message
export function timeDisplay(nextTimeAsString, currentTime) {
    if (!nextTimeAsString) return <p>No arrival data</p>;

    // the LTA API gives times in a string; it must be parsed to Unix time first
    const nextTime = Date.parse(nextTimeAsString);
    let duration = Math.floor((nextTime - currentTime) / 60000);

    let minsText = "mins";
    if (duration === 1) minsText = "min";
    if (duration < 0) duration = 0;

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
        >
            <Grid item>
                <Typography variant="h3">{duration}</Typography>
            </Grid>
            <Grid item>
                <Typography variant="body1">{minsText}</Typography>
            </Grid>
        </Grid>
    );
}

// this is used in notification
// it's the same as above, but returns it as plain text, without being in a component.
export function getArrivalDurationMins(nextTimeAsString, currentTime) {
    const nextTime = Date.parse(nextTimeAsString);
    const duration = Math.floor((nextTime - currentTime) / 60000);

    if (nextTime) {
        if (duration > 1) {
            return `${duration} mins`;
        } else if (duration === 1) {
            return `${duration} min`;
        } else {
            return "0 mins";
        }
    }
    return "No arrival data";
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
