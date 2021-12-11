import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

const ArrivalCard = (props) => {
    // TODO: ideally this should be fetching the time instead
    // const [duration, setDuration] = useState("no data");
    const [nextTime, setNextTime] = useState("");
    const [arrivalObject, setArrivalObject] = useState({});

    async function fetchArrivals(serviceNo, stop) {
        const response = await fetch(
            `https://arrivelah2.busrouter.sg/?id=${stop}`
        );
        const myJson = await response.json(); //extract JSON from the http response

        // update the card with the returned data
        for (let service of myJson.services) {
            if (service.no === serviceNo) {
                // display in mins, rounded down
                // setDuration(Math.floor(service.next.duration_ms / 60000));
                setNextTime(service.next.time);

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

    // on mount, update the data
    useEffect(() => {
        console.log(
            `Fetching data for Stop: ${props.data.stop}, ServiceNo: ${props.data.serviceNo}`
        );

        // TODO: this should be in try-catch
        // and per LTA's recommendation, if there's no arrival data, then should check whether bus is in operation,
        //      and display a message accordingly ("Not in operation" or "no arrival data" )
        fetchArrivals(props.data.serviceNo, props.data.stop);
    }, [props.data.serviceNo, props.data.stop]);

    return (
        <Card onClick={props.handleCardOnClick}>
            <CardActionArea>
                <CardContent>
                    <h2>
                        {props.data.serviceNo} at Stop: {props.data.stop}
                    </h2>
                    {/* <p>Mins: {duration}</p>
                    <p>Arrives at: {nextTime}</p>
                    <p>as Unix: {Date.parse(nextTime)}</p>
                    <p>Time right now: {Date.now()}</p> */}
                    <p>
                        mins until:{" "}
                        {Math.floor(
                            (Date.parse(nextTime) - Date.now()) / 60000
                        )}
                    </p>
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
