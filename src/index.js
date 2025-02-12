import React from "react";
import ReactDOM from 'react-dom/client';

import App from "./components/app/App";
import "./style/style.scss";

//  <React.StrictMode>
//     </React.StrictMode> 
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <App />
);

