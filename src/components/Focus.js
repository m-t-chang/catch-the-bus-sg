import React from "react";

const Focus = (props) => {
    return (
        <div onClick={props.handleFocusOnClick}>
            == FOCUS - One Stop, One Service CARD ==
            <p>Service No: {props.data.serviceNo}</p>
            <p>Mins: {props.data.duration}</p>
            <p>Later Arrivals</p>
            <p>Mins: {props.data.duration2}</p>
            <p>Mins: {props.data.duration3}</p>
        </div>
    );
};

export default Focus;
