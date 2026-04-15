import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import StampDuty from "./pages/StampDuty";
import Mortgage from "./pages/Mortgage";
import Contractor from "./pages/Contractor";
import RentalYield from "./pages/RentalYield";
import SideHustleTax from "./pages/SideHustleTax";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/stamp-duty" element={<StampDuty />} />
        <Route path="/mortgage" element={<Mortgage />} />
        <Route path="/contractor" element={<Contractor />} />
        <Route path="/rental-yield" element={<RentalYield />} />
        <Route path="/side-hustle-tax" element={<SideHustleTax />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
