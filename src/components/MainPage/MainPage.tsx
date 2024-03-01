import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";
import "./MainPage.scss";
import { handleScroll } from "../../services/helpers";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchPopularPhotos, fetchSearchImages } from "../../services/api";

const API_URL = "https://api.unsplash.com/photos";
const API_KEY = process.env.REACT_APP_API_KEY;

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
  filteredImgPage,
  setFilteredImgPage,
  setSearchHistory,
}: any) {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  const [page, setPage] = useState<number>(1);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{ [id: string]: object }>({});

  // const debouncedSearchInput = useDebounce<string>(searchInput);

  // const handleScrollRef = useRef(handleScroll(setPage));
  const handleFilteredScrollRef = useRef(handleScroll(setFilteredImgPage));

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

  //FILTER DATA

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
        setFilteredPhotos((prevPhotos) => [...prevPhotos, ...searchData]);
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
  useEffect(() => {
    const fetchStatistics = async () => {
      if (currentImage) {
        try {
          const response = await axios.get(
            `${API_URL}/${currentImage}/statistics`,
            {
              headers: {
                Authorization: `Client-ID ${API_KEY}`,
              },
            }
          );

          setStatistics((prevStats) => ({
            ...prevStats,
            [currentImage]: response.data,
          }));
          console.log(response.data);
        } catch (error) {
          console.error("Error fetching statistics:", error);
        }
      }
    };

    fetchStatistics();
  }, [currentImage]);

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
    const scrollListener = handleScroll(setPage);
    const handleScrollEvent = () => {
      scrollListener();
    };

    window.addEventListener("scroll", handleScrollEvent);
    return () => {
      window.removeEventListener("scroll", handleScrollEvent);
    };
  }, [setPage]);

  useEffect(() => {
    const filteredScrollListener = () => handleFilteredScrollRef.current();
    window.addEventListener("scroll", filteredScrollListener);

    return () => {
      window.removeEventListener("scroll", filteredScrollListener);
    };
  }, []);

  //toggle modal image
  const handleImageClick = (imageId: string) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen) => !isOpen);
  };

  //find image with input search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    const filtered = data.filter((photo: any) =>
      photo.alt_description.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredPhotos(filtered);
  };

  return (
    <main>
      <section>
        {/* <h1>Photo Gallery</h1> */}

        <div className="search-section">
          <input
            type="search"
            placeholder="🔎  Search for images "
            className="search-input"
            onChange={handleSearch}
          />
        </div>
        <Link to="/history" className="history-link">
          <h2>Search history➡</h2>
        </Link>
      </section>

      <section>
        <div className="photo-grid">
          {((searchInput === "" ? popularPhotos : filteredPhotos) ?? []).map(
            (photo: Photo, index: number) => (
              <div
                onClick={() => handleImageClick(photo.id)}
                key={`${photo.id}-${index}`}
              >
                <div className="img-container">
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
            )
          )}
        </div>
      </section>
    </main>
  );
}

export default MainPage;
