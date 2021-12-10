import React from "react";

const ArrivalCard = (props) => {
    return (
        <div onClick={props.handleCardOnClick}>
            == ARRIVAL CARD ==
            <p>Service No: {props.data.serviceNo}</p>
            <p>Stop: {props.data.stop}</p>
            <p>Mins: {props.data.duration}</p>
            <button onClick={() => props.handleCardRemove(props.id)}>
                Remove
            </button>
        </div>
    );
};

export default ArrivalCard;
