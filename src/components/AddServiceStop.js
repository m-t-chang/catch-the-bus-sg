import React, { useState } from "react";

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
                <button type="submit">Track This Stop</button>
            </form>
        </div>
    );
};

export default AddServiceStop;
