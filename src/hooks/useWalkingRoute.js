import { Typography } from "@mui/material";
import { useState, useEffect, useCallback } from "react";

export default function useWalkingRoute(
    originLon,
    originLat,
    destinationLon,
    destinationLat
) {
    // when bus stop and Location both load, calculate the walking distance

    const [route, setRoute] = useState({});

    const apiEndpoint = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.REACT_APP_ORS_API_KEY}&start=${originLon},${originLat}&end=${destinationLon},${destinationLat}`;

    // this needs to useCallback, otherwise it will cause an infinite loop with useEffect
    const fetchRoute = useCallback(
        async (
            apiEndpoint,
            originLon,
            originLat,
            destinationLon,
            destinationLat
        ) => {
            console.log(
                `Fetching walking route: start=${originLon},${originLat}&end=${destinationLon},${destinationLat}`
            );

            const response = await fetch(apiEndpoint);
            const myJson = await response.json();

            setRoute(myJson);
        },
        []
    );

    // on mount, fetch new arrival data, then setInterval to regularly repeat
    useEffect(() => {
        // check if data is legit first
        if (!originLon || !originLat || !destinationLon || !destinationLat) {
            console.log("bad coords, exiting");
            return;
        }

        fetchRoute(
            apiEndpoint,
            originLon,
            originLat,
            destinationLon,
            destinationLat
        );
    }, [
        fetchRoute,
        apiEndpoint,
        originLon,
        originLat,
        destinationLon,
        destinationLat,
    ]);

    return route;
}

export function displayWalkingDistance(walkingRoute) {
    return (
        <>
            <Typography>
                Distance by walking:{" "}
                {(
                    walkingRoute?.features?.[0]?.properties?.summary?.distance /
                    1000
                ).toFixed(1)}{" "}
                km
            </Typography>
            <Typography>
                Time by walking: {getWalkingTimeMins(walkingRoute).toFixed(0)}{" "}
                mins
            </Typography>
        </>
    );
}

export function getWalkingTimeMins(walkingRoute) {
    return walkingRoute?.features?.[0]?.properties?.summary?.duration / 60;
}
