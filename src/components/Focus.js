import React from "react";
import Button from "@mui/material/Button";

import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";

const Focus = (props) => {
    // https://api.openrouteservice.org/v2/directions/foot-walking?api_key=your-api-key&start=8.681495,49.41461&end=8.687872,49.420318

    // when bus stop and Location both load, calculate the walking distance

    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const busStop = useBusStopData(props.data.stop);
    const currentTime = useCurrentTime();

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
