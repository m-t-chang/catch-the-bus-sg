import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import StaticDataContext from "./StaticDataContext";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState("");
    const [stopInput, setStopInput] = useState("");
    const [inputValue, setInputValue] = useState("");
    const staticData = useContext(StaticDataContext);

    const top100Films = [
        { label: "The Shawshank Redemption", year: 1994 },
        { label: "The Godfather", year: 1972 },
        { label: "The Godfather: Part II", year: 1974 },
        { label: "The Dark Knight", year: 2008 },
        { label: "12 Angry Men", year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: "Pulp Fiction", year: 1994 },
    ];

    let busStopAutocomplete = "";
    if (staticData.busStops.data) {
        busStopAutocomplete = (
            <Autocomplete
                value={stopInput} // this matches the Options, in this case, an object
                onChange={(event, newValue) => setStopInput(newValue)}
                // inputValue={inputValue} //note that this is a string
                // onInputChange={(event, newInputValue) => {
                //     setInputValue(newInputValue);
                //     console.log(inputValue);
                // }}
                disablePortal
                id="busStop-combo-box"
                options={staticData.busStops.data}
                getOptionLabel={(option) =>
                    option.RoadName
                        ? `${option.RoadName} - ${option.Description}`
                        : ""
                }
                // renderOption based on https://stackoverflow.com/questions/69395945/how-can-i-add-unique-keys-to-react-mui-autocomplete-component
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.BusStopCode}>
                            {option.RoadName
                                ? `${option.RoadName} - ${option.Description}`
                                : ""}
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Bus Stop"
                    />
                )}
            />
        );
    } else {
        busStopAutocomplete = (
            <p>Loading bus stop options...</p>
            // // it would be cool to have an input that worked without the Autocomplete data...but this is tough and I gave up
            // <TextField
            //     value={serviceInput} // this matches the Options, in this case, an object
            //     onChange={(event) => {
            //         setServiceInput(event.target.value);
            //     }}
            //     id="busStop-combo-box"
            //     required
            //     variant="outlined"
            //     label="Bus Stop"
            // />
        );
    }
    let busServiceAutocomplete = "";
    if (staticData.busServices.data) {
        busServiceAutocomplete = (
            <Autocomplete
                value={serviceInput} // this matches the Options, in this case, an object
                onChange={(event, newValue) => setServiceInput(newValue)}
                // inputValue={inputValue} //note that this is a string
                // onInputChange={(event, newInputValue) => {
                //     setInputValue(newInputValue);
                //     console.log(inputValue);
                // }}
                disablePortal
                id="busService-combo-box"
                options={staticData.busServices.data}
                getOptionLabel={(option) =>
                    option.ServiceNo
                        ? `${option.ServiceNo} - ${option.Direction}`
                        : ""
                }
                // renderOption based on https://stackoverflow.com/questions/69395945/how-can-i-add-unique-keys-to-react-mui-autocomplete-component
                renderOption={(props, option) => {
                    return (
                        <li
                            {...props}
                            key={`${option.ServiceNo} - ${option.Direction}`}
                        >
                            {option.ServiceNo
                                ? `${option.ServiceNo} - ${option.Direction}`
                                : ""}
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required
                        variant="outlined"
                        label="Bus Service No."
                    />
                )}
            />
        );
    } else {
        busServiceAutocomplete = (
            <p>Loading bus service options...</p>
            // // it would be cool to have an input that worked without the Autocomplete data...but this is tough and I gave up
            // <TextField
            //     value={serviceInput} // this matches the Options, in this case, an object
            //     onChange={(event) => {
            //         setServiceInput(event.target.value);
            //     }}
            //     id="busStop-combo-box"
            //     required
            //     variant="outlined"
            //     label="Bus Stop"
            // />
        );
    }

    return (
        <div>
            == ADD NEW ==
            <form
                onSubmit={(event) =>
                    props.handleFormSubmit(event, serviceInput, stopInput)
                }
            >
                {busStopAutocomplete}
                {busServiceAutocomplete}
                {JSON.stringify(serviceInput)}
                {inputValue}
                {/* <input
                    type="text"
                    placeholder="Service No."
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value)}
                /> */}
                {/* <input
                    type="text"
                    placeholder="Stop"
                    value={stopInput}
                    onChange={(event) => setStopInput(event.target.value)}
                /> */}
                <Button variant="contained" type="submit">
                    Track This Stop
                </Button>
            </form>
        </div>
    );
};

export default AddServiceStop;
