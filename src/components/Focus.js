import React from "react";

const Focus = (props) => {
    // https://api.openrouteservice.org/v2/directions/foot-walking?api_key=your-api-key&start=8.681495,49.41461&end=8.687872,49.420318

    // when bus stop and Location both load, calculate the walking distance

    return (
        <div onClick={props.handleFocusOnClick}>
            == FOCUS - One Stop, One Service CARD ==
            <p>Service No: {props.data.serviceNo}</p>
            <p>Mins: {props.data.duration}</p>
            <p>Later Arrivals</p>
            <p>Mins: {props.data.duration2}</p>
            <p>Mins: {props.data.duration3}</p>
            {/* <h2>
                {props.data.serviceNo} at Stop: {props.data.stop}
            </h2>
            <h2>
                {busStop.RoadName} - {busStop.Description}
            </h2>
            {timeDisplay()}
            <p>Distance: {busStop.distanceFromUser} km</p> */}
        </div>
    );
};

export default Focus;
