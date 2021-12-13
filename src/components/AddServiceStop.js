import { v4 as uuidv4 } from "uuid";
import React, { useState, useContext, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import StaticDataContext from "./StaticDataContext";
import LocationDataContext from "./LocationDataContext";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState(null);
    const [stopInput, setStopInput] = useState(null);
    const [serviceInputText, setServiceInputText] = useState("");
    const [stopInputText, setStopInputText] = useState("");
    const staticData = useContext(StaticDataContext);
    const locationData = useContext(LocationDataContext);

    // define a state for the options that are appearing... it's not static!
    // need one for stops and services each
    const [stopsOnRoute, setStopsOnRoute] = useState([]);
    const [servicesAtStop, setServicesAtStop] = useState([]);

    // update stops based on service input
    useEffect(() => {
        // console.log("updating stops for service ", serviceInput);
        // console.log(serviceInputText);

        // if staticData is not loaded yet
        if (!staticData.busStops.data) {
            setStopsOnRoute([]);
            return;
        }
        // if input is blank, then display all services
        if (serviceInput === "" || serviceInput === null) {
            setStopsOnRoute(staticData.busStops.data);
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

    // update services based on stop input
    useEffect(() => {
        // if staticData is not loaded yet
        if (!staticData.busServices.data) {
            setServicesAtStop([]);
            return;
        }
        // if input is blank, then display all services
        if (stopInput === "" || stopInput === null) {
            setServicesAtStop(staticData.busServices.data);
            return;
        }

        // use reduce to get an array of busServiceNo, instead of filter which gives
        // an array of BusRoute objects
        const serviceNosAtStop = staticData.busRoutes.data.reduce(
            (prev, elem) => {
                if (elem.BusStopCode === stopInput.BusStopCode) {
                    prev.push(elem.ServiceNo);
                }
                return prev;
            },
            []
        );

        // turn the array of serviceNos into BusService objects
        const newServicesAtStop = staticData.busServices.data.filter(
            (service) => serviceNosAtStop.includes(service.ServiceNo)
        );

        setServicesAtStop(newServicesAtStop);
    }, [stopInput, staticData]);

    // console.log("at root, stopsOnRoute", stopsOnRoute);
    let busStopAutocomplete = "";
    if (staticData.busStops.data) {
        busStopAutocomplete = (
            <Autocomplete
                value={stopInput} // this matches the Options, in this case, an object
                onChange={(event, newValue) => setStopInput(newValue)}
                inputValue={stopInputText} //note that this is a string
                onInputChange={(event, newInputValue) =>
                    setStopInputText(newInputValue)
                }
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
                options={servicesAtStop}
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
                onSubmit={(event) => {
                    props.handleFormSubmit(event, serviceInput, stopInput);
                    setServiceInput("");
                    setStopInput("");
                }}
            >
                {busStopAutocomplete}
                {busServiceAutocomplete}
                {JSON.stringify(serviceInput)}
                {stopInputText}
                {serviceInputText}
                myLAT: {locationData.lat}
                myLON: {locationData.lon}
                <Button variant="contained" type="submit">
                    Track This Stop
                </Button>
            </form>
        </div>
    );
};

export default AddServiceStop;
