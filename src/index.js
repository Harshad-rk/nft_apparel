import React from "react";
import ReactDOM from "react-dom";
import "./assets/animated.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/elegant-icons/style.css";
import "../node_modules/et-line/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "./assets/style.scss";
import App from "./components/app";
import { DAppProvider } from "@usedapp/core";
import { ToastContainer } from "react-toastify";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import * as serviceWorker from "./serviceWorker";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
// ----------------------------------------------------------------------

function getLibrary(provider): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

ReactDOM.render(
    <ReduxProvider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
            <App />
            <ToastContainer />
        </Web3ReactProvider>
    </ReduxProvider>,
    document.getElementById("root"),
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
