import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// PUBLIC_INTERFACE
// Entrypoint for the React application. Renders the App which handles maintenance mode globally.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
