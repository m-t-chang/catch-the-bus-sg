import React from "react";
import Stack from "@mui/material/Stack";

import AddServiceStop from "./AddServiceStop";
import ArrivalCard from "./ArrivalCard";

const Browse = (props) => {
    return (
        <Stack spacing={2}>
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
        </Stack>
    );
};

export default Browse;
