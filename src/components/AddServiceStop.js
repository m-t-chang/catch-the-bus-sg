import React, { useState } from "react";
import Button from "@mui/material/Button";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState("");
    const [stopInput, setStopInput] = useState("");

    return (
        <div>
            == ADD NEW ==
            <form
                onSubmit={(event) =>
                    props.handleFormSubmit(event, serviceInput, stopInput)
                }
            >
                <input
                    type="text"
                    placeholder="Service No."
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Stop"
                    value={stopInput}
                    onChange={(event) => setStopInput(event.target.value)}
                />
                <Button variant="contained" type="submit">
                    Track This Stop
                </Button>
            </form>
        </div>
    );
};

export default AddServiceStop;
