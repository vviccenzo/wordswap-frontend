import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { Routers } from "./Routers.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { HomeProvider } from "./general/home/context/HomeContext.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HomeProvider>
      <UserProvider>
        <Routers />
      </UserProvider>
    </HomeProvider>
  </React.StrictMode>
);

reportWebVitals();
