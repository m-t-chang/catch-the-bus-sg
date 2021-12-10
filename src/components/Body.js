import React, { useState } from "react";
import Browse from "./Browse";
import NavBar from "./NavBar";
import Focus from "./Focus";

const Body = () => {
    const [activeView, setActiveView] = useState("browse");

    const [arrivalData, setArrivalData] = useState([
        {
            serviceNo: "123",
            stop: "02314",
            duration: "22",
            duration2: "34",
            duration3: "48",
        },
        {
            serviceNo: "99",
            stop: "44132",
            duration: "11",
            duration2: "34",
            duration3: "48",
        },
        {
            serviceNo: "334",
            stop: "77832",
            duration: "2",
            duration2: "34",
            duration3: "48",
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

    function handleFormSubmit(event, serviceNo, stop) {
        event.preventDefault();
        setArrivalData([...arrivalData, { serviceNo, stop }]);
        console.log("submit");
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
            <NavBar />
            {content}
        </div>
    );
};

export default Body;
