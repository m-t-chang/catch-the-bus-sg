import { v4 as uuidv4 } from "uuid";
import React, { useState, useContext, useEffect } from "react";
import {
    Typography,
    Button,
    TextField,
    Autocomplete,
    Card,
    Grid,
} from "@mui/material";
import StaticDataContext from "../contexts/StaticDataContext";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AddServiceStop = (props) => {
    const [serviceInput, setServiceInput] = useState(null);
    const [stopInput, setStopInput] = useState(null);
    const [serviceInputText, setServiceInputText] = useState("");
    const [stopInputText, setStopInputText] = useState("");
    const staticData = useContext(StaticDataContext);

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
            <Grid container direction="row" alignItems="center">
                <Grid item sx={{ color: "lightgray", paddingRight: 1.5 }}>
                    <LocationOnIcon fontSize="medium" />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
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
                                ? `${option.RoadName} - ${option.Description} - ${option.BusStopCode}`
                                : ""
                        }
                        // renderOption based on https://stackoverflow.com/questions/69395945/how-can-i-add-unique-keys-to-react-mui-autocomplete-component
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={uuidv4()}>
                                    {option.RoadName
                                        ? `${option.RoadName} - ${option.Description} - ${option.BusStopCode}`
                                        : ""}
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                variant="filled"
                                label="Bus Stop"
                            />
                        )}
                    />
                </Grid>
            </Grid>
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
            <Grid container direction="row" alignItems="center">
                <Grid item sx={{ color: "lightgray", paddingRight: 1.5 }}>
                    <DirectionsBusIcon fontSize="medium" />
                </Grid>
                <Grid item sx={{ flexGrow: 1 }}>
                    <Autocomplete
                        value={serviceInput} // this matches the Options, in this case, an object
                        onChange={(event, newValue) =>
                            setServiceInput(newValue)
                        }
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
                                variant="filled"
                                label="Bus Service No."
                            />
                        )}
                    />
                </Grid>
            </Grid>
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
        <Card variant="outlined" sx={{ padding: 1 }}>
            <Grid container direction="row" alignItems="center">
                <Grid item sx={{ paddingRight: 1 }}>
                    <SearchIcon fontSize="medium" />
                </Grid>
                <Grid item>
                    <Typography variant="h6">
                        Search for Bus Service and Stop
                    </Typography>
                </Grid>
            </Grid>

            <form
                onSubmit={(event) => {
                    props.handleFormSubmit(event, serviceInput, stopInput);
                    setServiceInput("");
                    setStopInput("");
                }}
            >
                <Grid
                    container
                    direction="row"
                    alignItems="stretch"
                    justifyContent="flex-end"
                    spacing={1}
                    padding={1}
                >
                    <Grid item xs={12}>
                        {busServiceAutocomplete}
                    </Grid>
                    <Grid item xs={12}>
                        {busStopAutocomplete}
                    </Grid>

                    <Grid item>
                        <Button
                            variant="contained"
                            type="submit"
                            startIcon={<AddIcon />}
                        >
                            Add to List
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Card>
    );
};

export default AddServiceStop;
