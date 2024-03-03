import { createContext, useState } from "react";
import useDebounce from "../components/MainPage/hooks/useDebounce";

export const ImagesContext = createContext<any>(null);

export const ImagesProvider = ({ children }: any) => {
  const [statistics, setStatistics] = useState<{ [id: string]: object }>({});
  const [searchInput, setSearchInput] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null | any>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [filteredPhotos, setFilteredPhotos] = useState<any[]>([]);
  const [wordsArr, setWordsArr] = useState<any[]>([]);

  const debouncedSearchInput = useDebounce<string>(searchInput);

  const contextValue = {
    statistics,
    setStatistics,
    searchInput,
    setSearchInput,
    currentImage,
    setCurrentImage,
    searchHistory,
    setSearchHistory,
    isOpenModal,
    setIsOpenModal,
    filteredPhotos,
    setFilteredPhotos,
    debouncedSearchInput,
    wordsArr,
    setWordsArr,
  };

  return (
    <ImagesContext.Provider value={contextValue}>
      {children}
    </ImagesContext.Provider>
  );
};

export default ImagesContext;
