import React, { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Browse from "./Browse";
import Focus from "./Focus";

const Body = () => {
    const history = useHistory();

    // default bus stops from :https://thesmartlocal.com/read/cool-bus-stops/
    const [serviceStops, setServiceStops] = useState([
        {
            serviceNo: "145",
            stop: "05421",
        },
        {
            serviceNo: "359",
            stop: "77171",
        },
        {
            serviceNo: "32",
            stop: "13059",
        },
        {
            serviceNo: "185",
            stop: "28469",
        },
    ]);

    // this function navigates the user to the "Focus" screen
    function handleCardOnClick(event, index) {
        // don't run if user clicked one of the other buttons on the card
        if (event.target.tagName.toLowerCase() === "button") return;

        console.log("user clicked on card index ", index);

        history.push(
            `/${serviceStops[index].stop}/${serviceStops[index].serviceNo}`
        );
    }

    // id = `${serviceNo}-${stop}`
    function handleCardRemove(id) {
        setServiceStops(
            serviceStops.filter(
                (elem) => `${elem.serviceNo}-${elem.stop}` !== id
            )
        );
    }

    function handleFormSubmit(event, serviceNoObj, stopObj) {
        event.preventDefault();

        // THIS VALIDATION CODE WAS WRITTEN WHEN THE ARGUMENTS WERE STRINGS, NOT OBJECTS
        // // validation 1: no empty strings
        // if (serviceNo === "" || stop === "") {
        //     console.log("invalid input. Add failed.");
        //     return;
        // }
        // // validation 2: must be unique
        // if (
        //     arrivalData.find(
        //         (elem) => elem.serviceNo === serviceNo && elem.stop === stop
        //     )
        // ) {
        //     console.log("service-stop is already tracked! Add failed.");
        //     return;
        // }

        // success
        setServiceStops([
            ...serviceStops,
            { serviceNo: serviceNoObj.ServiceNo, stop: stopObj.BusStopCode },
        ]);
        console.log("Add succeeded");
    }

    return (
        <Switch>
            <Route exact path="/">
                <Browse
                    data={serviceStops}
                    handleCardOnClick={handleCardOnClick}
                    handleCardRemove={handleCardRemove}
                    handleFormSubmit={handleFormSubmit}
                />
            </Route>
            <Route path="/:stop/:serviceNo">
                <Focus />
            </Route>
        </Switch>
    );
};

export default Body;
