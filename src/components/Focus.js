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
import LocationOnIcon from "@mui/icons-material/LocationOn";
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

// display notification
// note that this will ask for notification permission and then display the notification
function notifyMe(titleMsg = "Hello World!", body = "Notification template") {
    const title = `${titleMsg}  |  Catch the Bus SG`;
    const options = {
        body: body,
        // BUG: icon and image don't work, not sure why
        icon: "../logo192.png",
        image: "../logo192.png",
    };

    // notifications via service worker
    // source: https://stackoverflow.com/questions/31512504/html5-notification-not-working-in-mobile-chrome
    navigator.serviceWorker.register("../sw.js");
    Notification.requestPermission(function (result) {
        if (result === "granted") {
            navigator.serviceWorker.ready.then(function (registration) {
                registration.showNotification(title, options);
            });
        }
    });
}

const Focus = (props) => {
    const routerParams = useParams();
    const busArrival = useBusArrivalData(
        routerParams.serviceNo,
        routerParams.stop
    );
    const busStop = useBusStopData(routerParams.stop);
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
                    <Typography>
                        To catch the next bus, start walking in{" "}
                        {Math.floor(getWhenToLeaveMins())} mins
                    </Typography>
                );
            } else {
                return (
                    <Typography>
                        When to leave: Bus is already arriving
                    </Typography>
                );
            }
        }

        return (
            <Typography>Don't know when to leave; No arrival data</Typography>
        );
    }

    // scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // notifications
    useEffect(() => {
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
            setTimeout(function () {
                setNotificationEnabled(false);
            }, 1000);
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
            <Box sx={{ marginTop: 1, marginLeft: 1 }}>
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
                                        <Box
                                            sx={{
                                                backgroundColor: "#55dd33",
                                                paddingTop: 0.5,
                                                paddingBottom: 0.5,
                                                paddingRight: 1.5,
                                                paddingLeft: 1.5,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="h4">
                                                {routerParams.serviceNo}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Grid
                                    item
                                    container
                                    direction="row"
                                    alignItems="center"
                                >
                                    <Grid item sx={{ paddingRight: 1.8 }}>
                                        <LocationOnIcon fontSize="small" />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            {busStop?.RoadName} -{" "}
                                            {busStop?.Description}
                                            <br />
                                            {routerParams.stop}
                                        </Typography>
                                    </Grid>
                                </Grid>
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
                        <Typography variant="body1">
                            Distance: {busStop?.distanceFromUser?.toFixed(1)} km
                        </Typography>
                        {displayWalkingDistance(walkingRoute)}
                        {displayWhenToLeave()}
                        <br />
                        <Box sx={{ paddingLeft: 2 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notificationEnabled}
                                        onChange={(event) => {
                                            setNotificationEnabled(
                                                event.target.checked
                                            );
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontWeight: "bold" }}>
                                        Notify me when it's time to go
                                    </Typography>
                                }
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </>
    );
};

export default Focus;
