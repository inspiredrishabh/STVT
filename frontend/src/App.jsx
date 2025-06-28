// src/App.jsx
import React from "react";
import STCMain from "./STC/form/STCMain";
import WTCMain from "./WTC/form/WtcMain";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Wtc Details Form</h1>
      <WTCMain />
    </div>
  );
}

export default App;
