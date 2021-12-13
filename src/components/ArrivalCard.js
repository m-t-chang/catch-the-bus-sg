import React, { useState, useEffect, useCallback, useContext } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

import StaticDataContext from "./StaticDataContext";
import LocationDataContext from "./LocationDataContext";

const ArrivalCard = (props) => {
    const [nextTime, setNextTime] = useState("");
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [arrivalObject, setArrivalObject] = useState({});
    const [busStop, setBusStop] = useState({});
    const staticData = useContext(StaticDataContext);
    const locationData = useContext(LocationDataContext);

    // this needs to useCallback, otherwise it will cause an infinite loop with useEffect
    const fetchArrivals = useCallback(async (serviceNo, stop) => {
        console.log(`Fetching data for Stop: ${stop}, ServiceNo: ${serviceNo}`);

        const response = await fetch(
            `https://arrivelah2.busrouter.sg/?id=${stop}`
        );
        const myJson = await response.json();

        const arrivalObj = myJson.services.find(
            (service) => service.no === serviceNo
        );

        setArrivalObject(arrivalObj);
        setNextTime(Date.parse(arrivalObj.next.time));
    }, []);

    // on mount, fetch new arrival data, then setInterval to regularly repeat
    useEffect(() => {
        fetchArrivals(props.data.serviceNo, props.data.stop);
        const intervalId = setInterval(() => {
            // TODO: this should be in try-catch
            // and per LTA's recommendation, if there's no arrival data, then should check whether bus is in operation,
            //      and display a message accordingly ("Not in operation" or "no arrival data" )
            fetchArrivals(props.data.serviceNo, props.data.stop);
        }, 60000);
        return () => clearInterval(intervalId);
    }, [fetchArrivals, props.data.serviceNo, props.data.stop]);

    // on mount, start a timer to keep updating current time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 5000);

        return () => clearInterval(intervalId);
    }, []);

    // when staticData loads, get the bus stop data
    useEffect(() => {
        if (staticData.busStops) {
            // console.log(staticData.busStops);
            // console.log(!staticData.busStops);
            setBusStop(
                staticData.busStops.data.find(
                    (stop) => stop.BusStopCode === props.data.stop
                )
            );
        } else {
            setBusStop({});
        }
    }, [staticData]);

    // create the HTML element to display time until arrival or an error message
    function timeDisplay() {
        if (nextTime) {
            if (nextTime > currentTime) {
                return (
                    <p>{Math.floor((nextTime - currentTime) / 60000)} mins</p>
                );
            } else {
                return <p>0 mins</p>;
            }
        }
        return <p>No arrival data</p>;
    }

    return (
        <Card onClick={props.handleCardOnClick}>
            <CardActionArea>
                <CardContent>
                    <h2>
                        {props.data.serviceNo} at Stop: {props.data.stop}
                    </h2>
                    <h2>
                        {busStop.RoadName} - {busStop.Description}
                    </h2>
                    {timeDisplay()}
                    {busStop.Latitude}
                    {busStop.Longitude}
                    myLAT: {locationData.lat}
                    myLON: {locationData.lon}
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    variant="text"
                    onClick={() => props.handleCardRemove(props.id)}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );
};

export default ArrivalCard;
