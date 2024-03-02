import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import NotFoundPage from "./ui/NotFoundPage";
import Navbar from "./ui/Navbar";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useDebounce from "./components/MainPage/hooks/useDebounce";
import { ImagesContext } from "./context/context";

const queryClient = new QueryClient();

function App() {
  const [statistics, setStatistics] = useState<{ [id: string]: object }>({});
  const [searchInput, setSearchInput] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null | any>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);

  const debouncedSearchInput = useDebounce<string>(searchInput);

  //search images with rendered keywords
  const handleKeywordSearch = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const keyword: string = e.currentTarget.textContent || "";
    console.log(keyword);
    setSearchInput(keyword);
  };

  //toggle modal image
  const handleImageClick = (imageId: string, e: any) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen) => {
      if (isOpen && !e.target.classList.contains("overlay")) {
        return true;
      }
      return !isOpen;
    });
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ImagesContext.Provider
          value={{
            statistics,
            setStatistics,
            searchInput,
            setSearchInput,
            currentImage,
            searchHistory,
            setSearchHistory,
            isOpenModal,
            filteredPhotos,
            setFilteredPhotos,
          }}
        >
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/main" />} />
              <Route
                path="/main"
                element={
                  <MainPage
                    debouncedSearchInput={debouncedSearchInput}
                    handleImageClick={handleImageClick}
                  />
                }
              />
              <Route
                path="/history"
                element={
                  <HistoryPage
                    handleKeywordSearch={handleKeywordSearch}
                    debouncedSearchInput={debouncedSearchInput}
                    handleImageClick={handleImageClick}
                  />
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ImagesContext.Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;
