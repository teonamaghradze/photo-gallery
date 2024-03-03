import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import NotFoundPage from "./ui/NotFoundPage";
import Navbar from "./ui/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ImagesProvider } from "./context/context";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ImagesProvider value={{}}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/main" />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ImagesProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
