import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchSearchImages } from "../../services/api";
import "./HistoryPage.scss";
import Modal from "../../ui/Modal";
import ImageCard from "../MainPage/ImageCard";
import usePhotoStatistics from "../../hooks/usePhotoStatistics";

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
}: any) {
  const {
    data: searchData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchPhotos", debouncedSearchInput, filteredImgPage],
    queryFn: () => fetchSearchImages(debouncedSearchInput, filteredImgPage),
  });

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
  const statisticsData = usePhotoStatistics(currentImage, setStatistics);

  //-----------------------------------------------------------------//

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

      <div className="photo-grid">
        {searchData &&
          searchData.map((photo: any, index: number) => (
            <div
              onClick={(e) => handleImageClick(photo.id, e)}
              key={`${photo.id}-${index}`}
            >
              <div className="image-container">
                <img src={photo.urls.small} alt={photo.alt_description} />
              </div>
              <div>
                {isOpenModal && currentImage === photo.id && (
                  <Modal>
                    <ImageCard
                      photo={photo}
                      statistics={statistics[photo.id]}
                    />
                  </Modal>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default HistoryPage;
