import React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardActionArea,
    Typography,
    Grid,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeleteIcon from "@mui/icons-material/Delete";

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
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                    >
                        <Grid item>
                            <Grid
                                item
                                container
                                direction="row"
                                alignItems="center"
                            >
                                <Grid item sx={{ paddingRight: 1 }}>
                                    <DirectionsBusIcon fontSize="medium" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="h3">
                                        {props.data.serviceNo}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                container
                                direction="row"
                                alignItems="center"
                            >
                                <Grid item sx={{ paddingRight: 1.8 }}>
                                    <LocationOnIcon fontSize="small" />
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {busStop?.RoadName} -{" "}
                                        {busStop?.Description}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {/* <Typography variant="body1">
                            {busStop?.distanceFromUser?.toFixed(1)} km away
                        </Typography> */}
                        </Grid>
                        <Grid item>
                            {timeDisplay(busArrival?.next?.time, currentTime)}
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    startIcon={<DeleteIcon />}
                    variant="text"
                    onClick={() => props.handleCardRemove(props.id)}
                    sx={{ marginLeft: "auto" }}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );
};

export default ArrivalCard;
