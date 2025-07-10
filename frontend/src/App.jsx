import React from "react";
import STCMain from "./STC/form/STCMain";
import WTCMain from "./WTC/form/WtcMain";
import NonRailwayMain from "./NonRailway/form/NonRailwayMain";
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import Router from './Router'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </BrowserRouter>
  )       
}
export default App;
