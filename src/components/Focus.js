import React, { useContext, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";
import useWalkingRoute, {
    displayWalkingDistance,
    getWalkingTimeMins,
} from "../hooks/useWalkingRoute";

import LocationDataContext from "../contexts/LocationDataContext";

// testing notification. Code from https://developer.mozilla.org/en-US/docs/Web/API/notification
// note that this will ask for notification permission and then display the notification
function notifyMe() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    // If so, create a notification
    else if (Notification.permission === "granted") {
        var notification = new Notification("Hi there!");
        console.log("notification given");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification("Hi there!");
                console.log("notification given");
            }
        });
    }
}

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
    const [notificationEnabled, setNotificationEnabled] = useState(false);

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

    function displayWhenToLeave() {
        const nextTime = Date.parse(busArrival?.next?.time);
        const whenToLeaveMins =
            Math.floor((nextTime - currentTime) / 60000) -
            getWalkingTimeMins(walkingRoute);

        if (nextTime) {
            if (nextTime > currentTime) {
                return (
                    <p>
                        To catch the next bus, start walking in{" "}
                        {whenToLeaveMins.toFixed(0)} mins
                    </p>
                );
            } else {
                return <p>When to leave: Bus is already arriving</p>;
            }
        }

        return <p>Don't know when to leave; No arrival data</p>;
    }

    const handleChange = (event) => {
        setNotificationEnabled(event.target.checked);
        notifyMe();
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={props.handleFocusOnClick}>
                Go Back
            </Button> */}
            <Button component={Link} to="/" variant="outlined">
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
            {displayWhenToLeave()}
            <FormControlLabel
                control={
                    <Switch
                        checked={notificationEnabled}
                        onChange={handleChange}
                    />
                }
                label="Notify me when it's time to start walking to catch the bus"
            />
        </div>
    );
};

export default Focus;
