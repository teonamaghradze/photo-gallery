import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { fetchSearchImages } from "../../services/api";
import "./HistoryPage.scss";
import PhotoGrid from "../../ui/PhotoGrid";
import { ImagesContext } from "../../context/context";
import KeywordButton from "./KeywordButton";

function HistoryPage() {
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);

  const { setFilteredPhotos, debouncedSearchInput } = useContext(ImagesContext);

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

  //INFINITE SCROLL
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div className="history-container">
      <h1>History page</h1>
      <KeywordButton />
      <PhotoGrid photos={searchData || []} />
    </div>
  );
}

export default HistoryPage;
