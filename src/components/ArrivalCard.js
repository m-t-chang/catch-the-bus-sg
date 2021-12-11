import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

const ArrivalCard = (props) => {
    // TODO: ideally this should be fetching the time instead
    const [duration, setDuration] = useState("no data");
    const [arrivalObject, setArrivalObject] = useState({});

    // on mount, update the data
    useEffect(() => {
        console.log(
            `Fetching data for Stop: ${props.data.stop}, ServiceNo: ${props.data.serviceNo}`
        );

        // TODO: this should be in try-catch
        async function fetchArrivals() {
            const response = await fetch(
                `https://arrivelah2.busrouter.sg/?id=${props.data.stop}`
            );
            const myJson = await response.json(); //extract JSON from the http response

            // update the card with the returned data
            for (let service of myJson.services) {
                if (service.no === props.data.serviceNo) {
                    // display in mins, rounded down
                    setDuration(Math.floor(service.next.duration_ms / 60000));

                    // card.duration2 = Math.floor(
                    //     service.next2.duration_ms / 60000
                    // );
                    // card.duration3 = Math.floor(
                    //     service.next3.duration_ms / 60000
                    // );

                    setArrivalObject(service);
                }
            }
            console.log("Fetch complete");
        }
        fetchArrivals();
    }, []);

    return (
        <Card onClick={props.handleCardOnClick}>
            <CardActionArea>
                <CardContent>
                    <h2>
                        {props.data.serviceNo} at Stop: {props.data.stop}
                    </h2>
                    <p>Mins: {duration}</p>
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
