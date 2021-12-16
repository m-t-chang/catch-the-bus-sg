import React from "react";
import Stack from "@mui/material/Stack";

import AddServiceStop from "./AddServiceStop";
import ArrivalCard from "./ArrivalCard";

const Browse = (props) => {
    return (
        <Stack spacing={1} sx={{ padding: 1 }}>
            {props.data.map((elem, index) => (
                <ArrivalCard
                    id={elem.serviceNo + "-" + elem.stop}
                    key={elem.serviceNo + "-" + elem.stop}
                    data={elem}
                    index={index}
                    handleCardOnClick={props.handleCardOnClick}
                    handleCardRemove={props.handleCardRemove}
                />
            ))}
            <AddServiceStop handleFormSubmit={props.handleFormSubmit} />
        </Stack>
    );
};

export default Browse;
