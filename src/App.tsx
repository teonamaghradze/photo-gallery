import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
