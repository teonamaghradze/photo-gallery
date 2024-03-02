import { useEffect, useState } from "react";
import "./MainPage.scss";
import { handleScroll } from "../../services/helpers";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularPhotos, fetchSearchImages } from "../../services/api";
import usePhotoStatistics from "../../hooks/usePhotoStatistics";
import PhotoGrid from "../../ui/PhotoGrid";

interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: string;
}

function MainPage({
  setSearchInput,
  searchInput,
  debouncedSearchInput,

  setSearchHistory,
  currentImage,
  handleImageClick,
  isOpenModal,

  statistics,
  setStatistics,

  filteredPhotos,
  setFilteredPhotos,
}: any) {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState<number>(1);
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);

  //-----------------------------------------------------------------------//
  // // Fetch POPULAR images
  const { isPending, error, data } = useQuery({
    queryKey: ["popularPhotos", page],
    queryFn: () => fetchPopularPhotos(page),
  });

  useEffect(() => {
    if (data) {
      setPopularPhotos((prevPhotos) => [...prevPhotos, ...data]);
    }
  }, [data]);

  //===================================================//

  //FILTER IMAGES
  const { data: searchData } = useQuery({
    queryKey: ["searchPhotos", debouncedSearchInput, filteredImgPage],
    queryFn: () => fetchSearchImages(debouncedSearchInput, filteredImgPage),
  });

  // Handle search results
  useEffect(() => {
    if (searchData) {
      if (filteredImgPage === 1) {
        setFilteredPhotos(searchData);
      } else {
        setFilteredPhotos((prevPhotos: any) => [...prevPhotos, ...searchData]);
      }
    }
  }, [searchData, filteredImgPage]);

  useEffect(() => {
    if (debouncedSearchInput) {
      // Fetch the first page of filtered images
      fetchSearchImages(debouncedSearchInput, 1);
      setSearchHistory((prevHistory: any) => [
        ...prevHistory,
        debouncedSearchInput.trim(),
      ]);
    } else {
      setFilteredPhotos([]);
    }
  }, [debouncedSearchInput, setSearchHistory]);

  // Update the useEffect that listens to changes in filteredImgPage
  useEffect(() => {
    if (debouncedSearchInput) {
      // Fetch more pages of filtered images
      fetchSearchImages(debouncedSearchInput, filteredImgPage);
    }
  }, [filteredImgPage, debouncedSearchInput]);

  //=-------------------------------------------------------------------//

  // Fetch statistics for a photo

  usePhotoStatistics(currentImage, setStatistics);

  //--------------------------------------------------------------//
  //hide scroll while modal is open
  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpenModal]);

  //INFINITE SCROLL

  useEffect(() => {
    const popularScrollHandler = handleScroll(setPage, false);
    const filteredScrollHandler = handleScroll(setFilteredImgPage, true);

    window.addEventListener("scroll", popularScrollHandler);
    window.addEventListener("scroll", filteredScrollHandler);

    return () => {
      window.removeEventListener("scroll", popularScrollHandler);
      window.removeEventListener("scroll", filteredScrollHandler);
    };
  }, []);

  //find image with input search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const filtered = data.filter((photo: any) =>
      photo.alt_description.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredPhotos(filtered);
  };

  return (
    <main>
      <section>
        <h1>Photo Gallery</h1>

        <div className="search-section">
          <input
            type="search"
            placeholder="🔎  Search for images "
            className="search-input"
            onChange={handleSearch}
          />
        </div>
        <Link to="/history">
          <h2>Search history➡</h2>
        </Link>
      </section>

      <section>
        <PhotoGrid
          photos={searchInput === "" ? popularPhotos : filteredPhotos}
          handleImageClick={handleImageClick}
          isOpenModal={isOpenModal}
          currentImage={currentImage}
          statistics={statistics}
        />
      </section>
    </main>
  );
}

export default MainPage;
