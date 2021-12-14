import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

import StaticDataContext from "./StaticDataContext";
//import LocationDataContext from "./LocationDataContext";

import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";

const ArrivalCard = (props) => {
    const [currentTime, setCurrentTime] = useState(Date.now());
    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const [busStop, setBusStop] = useState({});
    const staticData = useContext(StaticDataContext);
    //const locationData = useContext(LocationDataContext);

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
    }, [staticData, props.data.stop]);

    return (
        <Card onClick={(event) => props.handleCardOnClick(event, props.index)}>
            <CardActionArea>
                <CardContent>
                    <h2>
                        {props.data.serviceNo} at Stop: {props.data.stop}
                    </h2>
                    <h2>
                        {busStop.RoadName} - {busStop.Description}
                    </h2>
                    {timeDisplay(busArrival.next?.time, currentTime)}
                    {/* {busStop.Latitude}
                    {busStop.Longitude} */}
                    <p>Distance: {busStop.distanceFromUser} km</p>
                    {/* myLAT: {locationData.lat}
                    myLON: {locationData.lon} */}
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
