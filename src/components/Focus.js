import React, { useContext, useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Divider,
    Switch,
    FormControlLabel,
    Grid,
    Typography,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
        icon: "../logo192.png",
        image: "../logo192.png",
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
        <>
            <Box sx={{ marginTop: 1 }}>
                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                >
                    Back to All Arrivals
                </Button>
            </Box>

            <Stack spacing={1} sx={{ padding: 1 }}>
                <Card>
                    <CardContent>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                        >
                            <Grid item>
                                <Grid
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                >
                                    <Grid item sx={{ paddingRight: 1 }}>
                                        <DirectionsBusIcon fontSize="medium" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h3">
                                            {routerParams.serviceNo}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                >
                                    {/* <Grid item sx={{ paddingRight: 1.5 }}>
                            <LocationOnIcon fontSize="small" />
                        </Grid> */}
                                    <Grid item>
                                        <Typography variant="body1">
                                            {busStop?.RoadName} -{" "}
                                            {busStop?.Description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* <Typography variant="body1">
                            {busStop?.distanceFromUser?.toFixed(1)} km away
                        </Typography> */}
                            </Grid>
                            <Grid item>
                                {timeDisplay(
                                    busArrival?.next?.time,
                                    currentTime
                                )}
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />
                        <br />
                        <Grid
                            container
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="space-between"
                        >
                            <Grid
                                item
                                container
                                direction="row"
                                alignItems="flex-end"
                                xs="auto"
                            >
                                <Grid item sx={{ paddingRight: 1 }}>
                                    <AccessTimeIcon fontSize="small" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="overline">
                                        More Arrivals
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                {timeDisplay(
                                    busArrival?.next2?.time,
                                    currentTime
                                )}
                            </Grid>
                            <Grid item>
                                {timeDisplay(
                                    busArrival?.next3?.time,
                                    currentTime
                                )}
                            </Grid>
                        </Grid>
                        <br />
                        <Divider />
                        <br />
                        <Grid container direction="row" alignItems="flex-end">
                            <Grid item sx={{ paddingRight: 1 }}>
                                <DirectionsWalkIcon fontSize="small" />
                            </Grid>
                            <Grid item>
                                <Typography variant="overline">
                                    Getting There
                                </Typography>
                            </Grid>
                        </Grid>
                        <p>Distance: {busStop?.distanceFromUser} km</p>
                        {displayWalkingDistance(walkingRoute)}
                        {displayWhenToLeave()}
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={notificationEnabled}
                                    onChange={(event) =>
                                        setNotificationEnabled(
                                            event.target.checked
                                        )
                                    }
                                />
                            }
                            label="Notify me when it's time to start walking to catch the bus"
                        />
                    </CardContent>
                </Card>
            </Stack>
        </>
    );
};

export default Focus;
