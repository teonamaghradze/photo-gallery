import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import NotFoundPage from "./ui/NotFoundPage";

// const queryClient = new QueryClient();

function App() {
  return (
    <>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/main" />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
