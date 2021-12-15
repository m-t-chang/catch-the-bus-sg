import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";

import Body from "./components/Body";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

import StaticDataContext from "./contexts/StaticDataContext";
import LocationDataContext from "./contexts/LocationDataContext";

import haversineDistance from "./haversine-distance";

import staticData from "./data/bus-reference-data.json";

// testing notification. Code from https://developer.mozilla.org/en-US/docs/Web/API/notification
function notifyMe() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
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

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

function App() {
    // const [staticData, setStaticData] = useState(busReferenceData);
    // //     busServices: "",
    // //     busRoutes: "",
    // //     busStops: "",
    // // });

    const [locationData, setLocationData] = useState({
        lat: "",
        lon: "",
    });

    // on mount, get user location data
    // Note: this happens only once. If the user moves around (e.g. walking), he/she should refresh the page to pull new location data
    useEffect(() => {
        console.log("Fetching user geolocation...");
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocationData({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                console.log("Error when trying to get geolocation:", error);
            }
        );
    }, []);

    // when location and staticData are both loaded, then update staticData with the distance
    useEffect(() => {
        console.log("adding distances to bus stops");

        // abort if either dataset doesn't exist
        if (!staticData.busStops.data || !locationData.lat) return;

        // calculate distance to all stops and save that info
        staticData.busStops.data.forEach(
            (busStop) =>
                (busStop.distanceFromUser = haversineDistance(
                    [locationData.lat, locationData.lon],
                    [busStop.Latitude, busStop.Longitude]
                ))
        );

        // sort the busStops array by distance
        staticData.busStops.data.sort(
            (a, b) => a.distanceFromUser - b.distanceFromUser
        );
    }, [locationData]);

    return (
        <StaticDataContext.Provider value={staticData}>
            <LocationDataContext.Provider value={locationData}>
                <button onClick={notifyMe}>Notify me!</button>
                <Container maxWidth="xs" sx={{ padding: 0 }}>
                    <LoadingScreen />

                    <NavBar />
                    <Body />
                </Container>
            </LocationDataContext.Provider>
        </StaticDataContext.Provider>
    );
}

export default App;
