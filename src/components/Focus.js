import React, { useContext } from "react";
import Button from "@mui/material/Button";

import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";
import useWalkingDistance from "../hooks/useWalkingDistance";

import LocationDataContext from "../contexts/LocationDataContext";

const Focus = (props) => {
    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const busStop = useBusStopData(props.data.stop);
    const currentTime = useCurrentTime();
    const locationData = useContext(LocationDataContext);
    const walkingDistance = useWalkingDistance(locationData, {
        lat: busStop.Latitude,
        lon: busStop.Longitude,
    });

    return (
        <div>
            <Button variant="outlined" onClick={props.handleFocusOnClick}>
                Go Back
            </Button>
            <h2>== FOCUS - One Stop, One Service CARD ==</h2>
            <h2>
                {props.data.serviceNo} at Stop: {props.data.stop}
            </h2>
            <h2>
                {busStop.RoadName} - {busStop.Description}
            </h2>
            {timeDisplay(busArrival.next?.time, currentTime)}
            <p>Distance: {busStop.distanceFromUser} km</p>
            <h3>Later Arrivals</h3>
            {timeDisplay(busArrival.next2?.time, currentTime)}
            {timeDisplay(busArrival.next3?.time, currentTime)}
            <h3>DEBUG: Arrival object</h3>
            {JSON.stringify(busArrival)}
        </div>
    );
};

export default Focus;
