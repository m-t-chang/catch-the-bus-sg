import { useState, useEffect, useCallback } from "react";

export default function useWalkingDistance(origin, destination) {
    // when bus stop and Location both load, calculate the walking distance

    const [walkingDist, setWalkingDist] = useState({});

    // this needs to useCallback, otherwise it will cause an infinite loop with useEffect
    const fetchRoute = useCallback(async (origin, destination) => {
        console.log(
            `Fetching walking directions: start=${origin.lon},${origin.lat} end=${destination.lon},${destination.lat}`
        );

        const apiEndpoint = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${process.env.REACT_APP_ORS_API_KEY}&start=${origin.lon},${origin.lat}&end=${destination.lon},${destination.lat}`;
        const response = await fetch(apiEndpoint);
        const myJson = await response.json();

        setWalkingDist(myJson);
    }, []);

    // on mount, fetch new arrival data, then setInterval to regularly repeat
    useEffect(() => {
        fetchRoute(origin, destination);
    }, [fetchRoute, origin, destination]);

    return walkingDist;
}
