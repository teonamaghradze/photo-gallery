import { useContext, useEffect, useState } from "react";
import "./HistoryPage.scss";
import { useQuery } from "@tanstack/react-query";
import { fetchSearchImages } from "../../services/api";
import PhotoGrid from "../../ui/PhotoGrid";
import { ImagesContext } from "../../context/context";
import KeywordButton from "./KeywordButton";
import { handleScroll } from "../../services/helpers";

function HistoryPage() {
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);

  const { filteredPhotos, setFilteredPhotos, debouncedSearchInput } =
    useContext(ImagesContext);

  const { data: searchData } = useQuery({
    queryKey: ["searchPhotos", debouncedSearchInput, filteredImgPage],
    queryFn: () => fetchSearchImages(debouncedSearchInput, filteredImgPage),
    retry: 3,
  });

  // Handle search results
  useEffect(() => {
    if (searchData) {
      if (filteredImgPage === 1) {
        setFilteredPhotos(searchData);
      } else {
        setFilteredPhotos((prevPhotos: string[]) => [
          ...prevPhotos,
          ...searchData,
        ]);
      }
    }
  }, [searchData, setFilteredPhotos, filteredImgPage]);

  // Handle infinite scroll
  useEffect(() => {
    const scrollHandler = handleScroll(() => {
      setFilteredImgPage((prevPage) => prevPage + 1);
    }, true);

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return (
    <div className="history-container">
      <h1>History page</h1>
      <KeywordButton />
      <PhotoGrid photos={filteredPhotos || []} />
    </div>
  );
}

export default HistoryPage;
