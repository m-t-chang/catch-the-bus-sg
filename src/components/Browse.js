import React from "react";
import AddServiceStop from "./AddServiceStop";
import ArrivalCard from "./ArrivalCard";

const Browse = (props) => {
    return (
        <div>
            {props.data.map((elem) => (
                <ArrivalCard
                    id={elem.serviceNo + "-" + elem.stop}
                    key={elem.serviceNo + "-" + elem.stop}
                    data={elem}
                    handleCardOnClick={props.handleCardOnClick}
                    handleCardRemove={props.handleCardRemove}
                />
            ))}
            <AddServiceStop handleFormSubmit={props.handleFormSubmit} />
        </div>
    );
};

export default Browse;
