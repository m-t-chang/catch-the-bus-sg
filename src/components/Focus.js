import React, { useContext, useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import useBusArrivalData, {
    timeDisplay,
    getArrivalDurationMins,
} from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";
import useWalkingRoute, {
    displayWalkingDistance,
    getWalkingTimeMins,
} from "../hooks/useWalkingRoute";

import LocationDataContext from "../contexts/LocationDataContext";

// testing notification. Code from https://developer.mozilla.org/en-US/docs/Web/API/notification
// note that this will ask for notification permission and then display the notification
function notifyMe(titleMsg = "Hello World!", body = "Notification template") {
    const title = `${titleMsg}  |  Catch the Bus SG`;
    const options = {
        body: body,
        // BUG: icon and image don't work, not sure why
        icon: "logo192.png",
        image: "logo192.png",
    };

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    // If so, create a notification
    else if (Notification.permission === "granted") {
        new Notification(title, options);
        console.log("notification given");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                new Notification(title, options);
                console.log("notification given");
            }
        });
    } else {
        console.warn("Notifications are disabled.");
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

    const getWhenToLeaveMins = useCallback(() => {
        const nextTime = Date.parse(busArrival?.next?.time);

        console.log("current time", currentTime);
        console.log("next time", nextTime);
        console.log("walking time", getWalkingTimeMins(walkingRoute));

        return (
            (nextTime - currentTime) / 60000 - getWalkingTimeMins(walkingRoute)
        );
    }, [busArrival, currentTime, walkingRoute]);

    function displayWhenToLeave() {
        const nextTime = Date.parse(busArrival?.next?.time);
        // the IF statements mimic the timeDisplay from busArrival. It will handle when busArrival is not loaded.
        if (nextTime) {
            if (nextTime > currentTime) {
                return (
                    <p>
                        To catch the next bus, start walking in{" "}
                        {Math.floor(getWhenToLeaveMins())} mins
                    </p>
                );
            } else {
                return <p>When to leave: Bus is already arriving</p>;
            }
        }

        return <p>Don't know when to leave; No arrival data</p>;
    }

    // notification system
    useEffect(() => {
        console.log("Checking whether to display notification or not");

        console.log("when to leave is: ", getWhenToLeaveMins());

        if (notificationEnabled && getWhenToLeaveMins() <= 0) {
            notifyMe(
                "Time to go!",
                `Service no. ${routerParams.serviceNo} at ${
                    busStop?.Description
                } arrives in ${getArrivalDurationMins(
                    busArrival?.next?.time,
                    currentTime
                )}.`
            );
            setNotificationEnabled(false);
        }
    }, [
        getWhenToLeaveMins,
        notificationEnabled,
        routerParams,
        busStop,
        busArrival,
        currentTime,
    ]);

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
                        onChange={(event) =>
                            setNotificationEnabled(event.target.checked)
                        }
                    />
                }
                label="Notify me when it's time to start walking to catch the bus"
            />
        </div>
    );
};

export default Focus;
