import React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { CardActions, CardContent, CardActionArea } from "@mui/material";

const ArrivalCard = (props) => {
    return (
        <Card onClick={props.handleCardOnClick}>
            <CardActionArea>
                <CardContent>
                    <h2>Service No: {props.data.serviceNo}</h2>
                    <h2>Stop: {props.data.stop}</h2>
                    <p>Mins: {props.data.duration}</p>
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
