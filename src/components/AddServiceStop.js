import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import StaticDataContext from "./StaticDataContext";
import { v4 as uuidv4 } from "uuid";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState("");
    const [stopInput, setStopInput] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [serviceInputText, setServiceInputText] = useState("");
    const staticData = useContext(StaticDataContext);

    // define a state for the options that are appearing... it's not static!
    // need one for stops and services each
    const [stopsOnRoute, setStopsOnRoute] = useState("");
    const [servicesAtStop, setServicesAtStop] = useState("");

    // on input change
    //  if it's valid, then filter the other input
    //  need to refer to BusRoutes

    // update stops based on service input
    useEffect(() => {
        // console.log("updating stops for service ", serviceInput);
        // console.log(serviceInputText);
        // if input is blank, then display all stops
        if (serviceInputText === "") {
            // this prevents error if staticData is not loaded. Which always happens on the first render of the app loading
            setStopsOnRoute(
                staticData.busStops.data ? staticData.busStops.data : ""
            );
            return;
        }

        // use reduce to get an array of busStopCodes, instead of filter which gives
        // an array of BusRoute objects
        const stopCodesOnRoute = staticData.busRoutes.data.reduce(
            (prev, elem) => {
                if (elem.ServiceNo === serviceInput.ServiceNo) {
                    prev.push(elem.BusStopCode);
                }
                return prev;
            },
            []
        );
        // console.log("stopCodesOnRoute ", stopCodesOnRoute);

        // use the array of BusStopCodes to filter the array of BusStops
        // use map, to retain the original order of the route
        const newStopsOnRoute = stopCodesOnRoute.map((code) =>
            staticData.busStops.data.find(
                (busStop) => busStop.BusStopCode === code
            )
        );
        // console.log("newStopsOnRoute", newStopsOnRoute);

        setStopsOnRoute(newStopsOnRoute);
    }, [serviceInput, staticData]);

    /*
    function updateServicesForStop(e) {
        //console.log("updating bus services for ", e.target.value);

        // if input is blank, then display all services
        if (e.target.value === "") {
            populateBusServicesMenu(busServices);
            return;
        }

        // use reduce to get an array of busServiceNo, instead of filter which gives
        // an array of BusRoute objects
        const serviceNosAtStop = busRoutes.reduce((prev, elem) => {
            if (elem.BusStopCode === e.target.value) {
                prev.push(elem.ServiceNo);
            }
            return prev;
        }, []);
        //console.log(serviceNosAtStop);

        // turn the array of serviceNos into BusService objects
        const servicesAtStop = busServices.filter((service) =>
            serviceNosAtStop.includes(service.ServiceNo)
        );
        //console.log("services at stop", servicesAtStop);

        populateBusServicesMenu(servicesAtStop);
    }
*/
    ///////////////

    console.log("at root, stopsOnRoute", stopsOnRoute);
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
                // options={staticData.busStops.data}
                options={stopsOnRoute}
                getOptionLabel={(option) =>
                    option.RoadName
                        ? `${option.RoadName} - ${option.Description}`
                        : ""
                }
                // renderOption based on https://stackoverflow.com/questions/69395945/how-can-i-add-unique-keys-to-react-mui-autocomplete-component
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={uuidv4()}>
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
                inputValue={serviceInputText} //note that this is a string
                onInputChange={(event, newInputValue) =>
                    setServiceInputText(newInputValue)
                }
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
                        <li {...props} key={uuidv4()}>
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
