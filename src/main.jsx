import React from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import { Home } from "./Home";
import "./style.css";
import "./home.css";


const WebComponent = reactToWebComponent(Home, React, ReactDOM);
customElements.define("ruggeri-fit", WebComponent);
