import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";
import useWalkingRoute, {
    displayWalkingDistance,
} from "../hooks/useWalkingRoute";

import LocationDataContext from "../contexts/LocationDataContext";

const Focus = (props) => {
    const routerParams = useParams();
    const busArrival = useBusArrivalData(
        routerParams.serviceNo,
        routerParams.stop
    );
    const busStop = useBusStopData(routerParams.stop);
    // const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    // const busStop = useBusStopData(props.data.stop);
    const currentTime = useCurrentTime();
    const locationData = useContext(LocationDataContext);

    // the inputs to useWalkingRoute must be React states, otherwise
    // the hook will fetch from API on every render of this component (every 5 secs)
    // Namely, passing in an object literal like {lat: x, lon: y}, even if x and y are React states,
    //  causes lots of re-renders.
    const walkingRoute = useWalkingRoute(
        locationData.lon,
        locationData.lat,
        busStop.Longitude,
        busStop.Latitude
    );

    return (
        <div>
            <Button variant="outlined" onClick={props.handleFocusOnClick}>
                Go Back
            </Button>
            <h2>== FOCUS - One Stop, One Service CARD ==</h2>
            <h2>
                {/* {props.data.serviceNo} at Stop: {props.data.stop} */}
                {routerParams.serviceNo} at Stop: {routerParams.stop}
            </h2>
            <h2>
                {busStop?.RoadName} - {busStop?.Description}
            </h2>
            {timeDisplay(busArrival?.next?.time, currentTime)}
            <p>Distance: {busStop?.distanceFromUser} km</p>
            <h3>Later Arrivals</h3>
            {timeDisplay(busArrival?.next2?.time, currentTime)}
            {timeDisplay(busArrival?.next3?.time, currentTime)}
            {/* <h3>DEBUG: Arrival object</h3>
            {JSON.stringify(busArrival)}
            <h3>DEBUG: walkingRoute object</h3>
            {JSON.stringify(walkingRoute)} */}
            <br />
            {displayWalkingDistance(walkingRoute)}
        </div>
    );
};

export default Focus;
