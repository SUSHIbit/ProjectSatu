import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// No JSX syntax here, just plain JavaScript
const container = document.getElementById("app");
const root = createRoot(container);
root.render(React.createElement(App)); // Using createElement instead of JSX
