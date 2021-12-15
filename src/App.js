import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";

import Body from "./components/Body";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

import StaticDataContext from "./contexts/StaticDataContext";
import LocationDataContext from "./contexts/LocationDataContext";

import haversineDistance from "./haversine-distance";

import staticData from "./data/bus-reference-data.json";

function App() {
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
