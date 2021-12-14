import React, { useState, useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

// hooks
import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";

const ArrivalCard = (props) => {
    const currentTime = useCurrentTime();
    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const busStop = useBusStopData(props.data.stop);

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
