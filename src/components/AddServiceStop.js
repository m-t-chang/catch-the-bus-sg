import React, { useState } from "react";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState("");
    const [stopInput, setStopInput] = useState("");

    function handleServiceChange(event) {
        setServiceInput(event.target.value);
    }

    function handleStopChange(event) {
        setStopInput(event.target.value);
    }

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
                    onChange={handleServiceChange}
                />
                <input
                    type="text"
                    placeholder="Stop"
                    value={stopInput}
                    onChange={handleStopChange}
                />
                <button type="submit">Track This Stop</button>
            </form>
        </div>
    );
};

export default AddServiceStop;
