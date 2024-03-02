import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { fetchSearchImages } from "../../services/api";
import "./HistoryPage.scss";
import PhotoGrid from "../../ui/PhotoGrid";
import { ImagesContext } from "../../context/context";

function HistoryPage({
  handleKeywordSearch,
  debouncedSearchInput,

  handleImageClick,
}: any) {
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);
  const [wordsArr, setWordsArr] = useState<any[]>([]);
  const { searchHistory, setFilteredPhotos } = useContext(ImagesContext);
  const {
    data: searchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchPhotos", debouncedSearchInput],
    queryFn: () => fetchSearchImages(debouncedSearchInput, filteredImgPage),
    retry: 3,
  });

  // Handle search results
  useEffect(() => {
    if (searchData) {
      setFilteredPhotos(() => [...searchData]);
    }
  }, [searchData, setFilteredPhotos]);

  // Update search history
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword: any) => keyword.toLowerCase().trim()))
    );

    setWordsArr(uniqueKeywords);
  }, [searchHistory, setWordsArr]);

  //INFINITE SCROLL
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="history-container">
      <h1>History page</h1>

      <div className="buttons">
        {wordsArr.map((word: string, index: number) => (
          <p onClick={handleKeywordSearch} key={index}>
            {word}
          </p>
        ))}
      </div>
      <PhotoGrid
        photos={searchData || []}
        handleImageClick={handleImageClick}
      />
    </div>
  );
}

export default HistoryPage;
