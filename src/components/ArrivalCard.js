import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    Typography,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";

// hooks
import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useBusStopData from "../hooks/useBusStopData";
import useCurrentTime from "../hooks/useCurrentTime";

const ArrivalCard = (props) => {
    const currentTime = useCurrentTime();
    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const busStop = useBusStopData(props.data.stop);

    return (
        <Card
            variant="elevation"
            onClick={(event) => props.handleCardOnClick(event, props.index)}
        >
            <CardActionArea>
                <CardContent>
                    <DirectionsBusIcon />
                    <Typography variant="h3">{props.data.serviceNo}</Typography>
                    <Typography variant="h6">
                        {busStop?.RoadName} - {busStop?.Description}
                    </Typography>
                    {timeDisplay(busArrival?.next?.time, currentTime)}
                    <Typography variant="body1">
                        {busStop?.distanceFromUser?.toFixed(1)} km away
                    </Typography>
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
