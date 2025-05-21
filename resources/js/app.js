import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Use non-JSX syntax to avoid transpilation issues
const container = document.getElementById("app");
const root = createRoot(container);
root.render(React.createElement(App));
