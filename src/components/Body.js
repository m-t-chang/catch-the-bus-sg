import React, { useState, useEffect } from "react";
import Browse from "./Browse";
import Focus from "./Focus";
import StaticDataContext from "./StaticDataContext";

const Body = () => {
    const [activeView, setActiveView] = useState("browse");
    const [staticData, setStaticData] = useState({
        busServices: "",
        busRoutes: "",
        busStops: "",
    });

    // on Mount, read in static bus data
    // need to define another async function and run it b/c the useEffect function must be synchronous
    useEffect(() => {
        async function fetchStaticData() {
            const res = await fetch("bus-reference-data.json", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            const LTADataMall = await res.json();

            setStaticData(LTADataMall);
        }
        fetchStaticData();
    }, []);

    // when staticData gets updated, do this
    useEffect(() => {
        console.log(staticData);

        // load the static data into the autocomplete
    }, [staticData]);

    // TODO: consider renaming "arrivalData" to "trackedServiceStops", since it no longer contains the duration data
    const [arrivalData, setArrivalData] = useState([
        // {
        //     serviceNo: "185",
        //     stop: "28469",
        // },
        // {
        //     serviceNo: "502",
        //     stop: "03217",
        // },
        {
            serviceNo: "187",
            stop: "28469",
        },
    ]);

    function handleCardOnClick(event) {
        if (event.target.tagName.toLowerCase() === "button") return;
        setActiveView("focus");
    }

    // id = `${serviceNo}-${stop}`
    function handleCardRemove(id) {
        setArrivalData(
            arrivalData.filter(
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
        setArrivalData([
            ...arrivalData,
            { serviceNo: serviceNoObj.ServiceNo, stop: stopObj.BusStopCode },
        ]);
        console.log("Add succeeded");
    }

    let content = (
        <Browse
            data={arrivalData}
            handleCardOnClick={handleCardOnClick}
            handleCardRemove={handleCardRemove}
            handleFormSubmit={handleFormSubmit}
        />
    );
    if (activeView === "focus") {
        content = (
            <Focus
                data={arrivalData[0]}
                handleFocusOnClick={handleFocusOnClick}
            />
        );
    }

    return (
        <div>
            <StaticDataContext.Provider value={staticData}>
                {content}
            </StaticDataContext.Provider>
        </div>
    );
};

export default Body;
