import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.render(
    <BrowserRouter>
        <React.StrictMode>
            <CssBaseline />
            <App />
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById("root")
);
