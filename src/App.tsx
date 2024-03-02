import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import NotFoundPage from "./ui/NotFoundPage";
import Navbar from "./ui/Navbar";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useDebounce from "./components/MainPage/hooks/useDebounce";

const queryClient = new QueryClient();

function App() {
  const [wordsArr, setWordsArr] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce<string>(searchInput);
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null | any>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<{ [id: string]: object }>({});

  //search images with rendered keywords
  const handleKeywordSearch = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const keyword: string = e.currentTarget.textContent || "";
    console.log(keyword);
    setSearchInput(keyword);
  };

  //toggle modal image
  const handleImageClick = (imageId: string) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen) => !isOpen);
  };

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/main" />} />
            <Route
              path="/main"
              element={
                <MainPage
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  debouncedSearchInput={debouncedSearchInput}
                  filteredImgPage={filteredImgPage}
                  setFilteredImgPage={setFilteredImgPage}
                  setSearchHistory={setSearchHistory}
                  currentImage={currentImage}
                  handleImageClick={handleImageClick}
                  isOpenModal={isOpenModal}
                  statistics={statistics}
                  setStatistics={setStatistics}
                />
              }
            />
            <Route
              path="/history"
              element={
                <HistoryPage
                  wordsArr={wordsArr}
                  handleKeywordSearch={handleKeywordSearch}
                  debouncedSearchInput={debouncedSearchInput}
                  filteredImgPage={filteredImgPage}
                  setWordsArr={setWordsArr}
                  searchHistory={searchHistory}
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
}

export default App;
