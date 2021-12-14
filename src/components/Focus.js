import React from "react";
import useBusArrivalData, { timeDisplay } from "../hooks/useBusArrivalData";
import useCurrentTime from "../hooks/useCurrentTime";

const Focus = (props) => {
    // https://api.openrouteservice.org/v2/directions/foot-walking?api_key=your-api-key&start=8.681495,49.41461&end=8.687872,49.420318

    // when bus stop and Location both load, calculate the walking distance

    const busArrival = useBusArrivalData(props.data.serviceNo, props.data.stop);
    const currentTime = useCurrentTime();

    return (
        <div onClick={props.handleFocusOnClick}>
            == FOCUS - One Stop, One Service CARD ==
            <h2>
                {props.data.serviceNo} at Stop: {props.data.stop}
            </h2>
            <h2>{/* {busStop.RoadName} - {busStop.Description} */}</h2>
            {timeDisplay(busArrival.next?.time, currentTime)}
            {""}
            <p>Later Arrivals</p>
            <p>2: {busArrival.next2?.time}</p>
            <p>3: {busArrival.next3?.time}</p>
            {JSON.stringify(busArrival)}
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
