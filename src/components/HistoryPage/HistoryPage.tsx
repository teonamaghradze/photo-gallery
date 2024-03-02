import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchSearchImages } from "../../services/api";
import "./HistoryPage.scss";

import usePhotoStatistics from "../../hooks/usePhotoStatistics";

import PhotoGrid from "../../ui/PhotoGrid";

function HistoryPage({
  wordsArr,
  handleKeywordSearch,
  debouncedSearchInput,
  filteredImgPage,
  setWordsArr,
  searchHistory,
  handleImageClick,
  isOpenModal,
  currentImage,
  statistics,
  setStatistics,
  handleFilteredScrollRef,
  setFilteredPhotos,
}: any) {
  const {
    data: searchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchPhotos", debouncedSearchInput, filteredImgPage],
    queryFn: () => fetchSearchImages(debouncedSearchInput, filteredImgPage),
    retry: 3,
  });

  const [historyImages, setHistoryImages] = useState<any>([]);

  // Handle search results
  useEffect(() => {
    if (searchData) {
      if (filteredImgPage === 1) {
        // setFilteredPhotos(searchData);
        setHistoryImages(searchData);
      } else {
        console.log(1111);

        setHistoryImages((prevPhotos: any) => [...prevPhotos, ...searchData]);
      }
    }
  }, [searchData, filteredImgPage, setFilteredPhotos]);

  //render inputed keywords
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword: any) => keyword.toLowerCase().trim()))
    );
    const word = uniqueKeywords.pop();

    setWordsArr((prevWords: any) => [...prevWords, word]);
  }, [searchHistory, setWordsArr]);

  // Update search history
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword: any) => keyword.toLowerCase().trim()))
    );

    setWordsArr(uniqueKeywords);
  }, [searchHistory, setWordsArr]);

  //-------------------------------------------------------------------------//
  //STAtIstics
  usePhotoStatistics(currentImage, setStatistics);

  //-----------------------------------------------------------------//

  //INFINITE SCROLL

  useEffect(() => {
    const filteredScrollListener = () => handleFilteredScrollRef.current();

    window.addEventListener("scroll", filteredScrollListener);

    return () => {
      window.removeEventListener("scroll", filteredScrollListener);
    };
  }, [handleFilteredScrollRef]);

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
        isOpenModal={isOpenModal}
        currentImage={currentImage}
        statistics={statistics}
      />
    </div>
  );
}

export default HistoryPage;
