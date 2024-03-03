import React, { useContext, useEffect } from "react";
import ImagesContext from "../../context/context";

function KeywordButton() {
  const { setWordsArr, wordsArr, searchHistory, setSearchInput } =
    useContext(ImagesContext);

  // Update search history
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword: any) => keyword.toLowerCase().trim()))
    );

    setWordsArr(uniqueKeywords);
  }, [searchHistory, setWordsArr]);

  //search images with rendered keywords
  const handleKeywordSearch = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const keyword: string = e.currentTarget.textContent || "";
    console.log(keyword);
    setSearchInput(keyword);
  };

  return (
    <div className="buttons">
      {wordsArr?.map((word: string, index: number) => (
        <p onClick={handleKeywordSearch} key={index}>
          {word}
        </p>
      ))}
    </div>
  );
}

export default KeywordButton;
