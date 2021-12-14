import React, { useState } from "react";
import Browse from "./Browse";
import Focus from "./Focus";

const Body = () => {
    const [activeView, setActiveView] = useState("browse");

    const [focusViewIndex, setFocusViewIndex] = useState(null);
    const [serviceStops, setServiceStops] = useState([
        {
            serviceNo: "185",
            stop: "28469",
        },
        {
            serviceNo: "502",
            stop: "03217",
        },
        {
            serviceNo: "187",
            stop: "28469",
        },
    ]);

    // this function navigates the user to the "Focus" screen
    function handleCardOnClick(event, index) {
        // don't run if user clicked one of the other buttons on the card
        if (event.target.tagName.toLowerCase() === "button") return;

        console.log("user clicked on card index ", index);
        setFocusViewIndex(index);
        setActiveView("focus");
    }

    // id = `${serviceNo}-${stop}`
    function handleCardRemove(id) {
        setServiceStops(
            serviceStops.filter(
                (elem) => `${elem.serviceNo}-${elem.stop}` !== id
            )
        );
    }

    function handleFocusOnClick() {
        setActiveView("browse");
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

    let content = (
        <Browse
            data={serviceStops}
            handleCardOnClick={handleCardOnClick}
            handleCardRemove={handleCardRemove}
            handleFormSubmit={handleFormSubmit}
        />
    );
    if (activeView === "focus") {
        content = (
            <Focus
                data={serviceStops[focusViewIndex]}
                handleFocusOnClick={handleFocusOnClick}
            />
        );
    }

    return <div>{content}</div>;
};

export default Body;
