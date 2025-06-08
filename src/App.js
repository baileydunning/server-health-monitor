// App.js

import React from "react";
import QueryCampsites from "./components/QueryCampsites";
import ServerHealth from "./components/ServerHealth";
import ConsoleTerminal from "./components/ConsoleTerminal";
import "./App.css";

function App() {
  return (
    <div className="App app-container">
      <h1 className="dashboard-title">
        Campsites Streaming Server Health Dashboard
      </h1>

      <div className="dashboard-wrapper">
        <div className="panel">
          <ServerHealth />
          <QueryCampsites />
        </div>
        <div className="panel">
          <ConsoleTerminal />
        </div>
      </div>
    </div>
  );
}

export default App;
