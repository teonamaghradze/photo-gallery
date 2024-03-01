import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSearchImages } from "../../services/api";

function HistoryPage({
  wordsArr,
  handleKeywordSearch,
  debouncedSearchInput,
  filteredImgPage,
  setWordsArr,
  searchHistory,
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

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <Link to="/">Go back to MainPage</Link>
      <h1>History page</h1>

      {wordsArr.map((word: string, index: number) => (
        <h2 onClick={handleKeywordSearch} key={index}>
          {word}
        </h2>
      ))}

      {searchData &&
        searchData.map((photo: any, index: number) => (
          <div key={index}>
            <img src={photo.urls.small} alt={photo.alt_description} />
          </div>
        ))}
    </div>
  );
}

export default HistoryPage;
