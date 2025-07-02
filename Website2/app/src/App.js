import React from "react";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import BuyDash from "./components/BuyDashboard";
import SellDash from "./components/SellDashBoard";
import BuySkinPage from "./components/BuySkinPage";
import SellSkin from "./components/SellSkinPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* //CompanyList */}
          <Route path="/:userName/Sell" element={<SellDash />} />
          <Route path="/:userName/DashBoard" element={<BuyDash />} />
          <Route path="/:userName/Buy/:skinId" element={<BuySkinPage />} />
          <Route path="/:userName/Sell/:skinId" element={<SellSkin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
