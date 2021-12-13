import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";

import Body from "./components/Body";
import LoadingScreen from "./components/LoadingScreen";
import NavBar from "./components/NavBar";

import StaticDataContext from "./components/StaticDataContext";
import LocationDataContext from "./components/LocationDataContext";

function App() {
    const [staticData, setStaticData] = useState({
        busServices: "",
        busRoutes: "",
        busStops: "",
    });

    const [locationData, setLocationData] = useState({
        lat: "",
        lon: "",
    });

    // on Mount, read in static bus data
    // need to define another async function and run it b/c the useEffect function must be synchronous
    useEffect(() => {
        async function fetchStaticData() {
            const res = await fetch("bus-reference-data.json", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const LTADataMall = await res.json();

            setStaticData(LTADataMall);
        }
        fetchStaticData();
    }, []);

    useEffect(() => {
        setLocationData({ lat: 1, lon: 2 });
    }, []);

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
