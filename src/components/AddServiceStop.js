import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState("");
    const [stopInput, setStopInput] = useState("");
    const [inputValue, setInputValue] = useState("");

    const top100Films = [
        { label: "The Shawshank Redemption", year: 1994 },
        { label: "The Godfather", year: 1972 },
        { label: "The Godfather: Part II", year: 1974 },
        { label: "The Dark Knight", year: 2008 },
        { label: "12 Angry Men", year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: "Pulp Fiction", year: 1994 },
    ];

    return (
        <div>
            == ADD NEW ==
            <form
                onSubmit={(event) =>
                    props.handleFormSubmit(event, serviceInput, stopInput)
                }
            >
                <Autocomplete
                    value={serviceInput} // this matches the Options, in this case, an object
                    onChange={(event, newValue) => setServiceInput(newValue)}
                    inputValue={inputValue} //note that this is a string
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        console.log(inputValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={top100Films}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            variant="outlined"
                            label="Movie"
                        />
                    )}
                />
                {serviceInput.label}
                {serviceInput.year}
                {inputValue}
                {/* <input
                    type="text"
                    placeholder="Service No."
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value)}
                /> */}
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
