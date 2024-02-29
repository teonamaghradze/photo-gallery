import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";
import "./MainPage.scss";
import { handleScroll } from "../../services/helpers";
import { Link } from "react-router-dom";
import useDebounce from "./hooks/useDebounce";

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

function MainPage() {
  const [popularPhotos, setPopularPhotos] = useState<Photo[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([]);

  const [page, setPage] = useState<number>(1);
  const [filteredImgPage, setFilteredImgPage] = useState<number>(1);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{ [id: string]: object }>({});

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce<string>(searchInput);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [wordsArr, setWordsArr] = useState<string[]>([]);

  const handleScrollRef = useRef(handleScroll(setPage));
  const handleFilteredScrollRef = useRef(handleScroll(setFilteredImgPage));

  // Fetch images based on search input
  const searchImages = async (query: string, page: number) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: query,
            per_page: 20,
            page: page,
          },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        }
      );

      // Update filteredPhotos based on the page number
      if (page === 1) {
        setFilteredPhotos(response.data.results);
      } else {
        setFilteredPhotos((prevPhotos) => [
          ...prevPhotos,
          ...response.data.results,
        ]);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearchInput) {
      // Fetch the first page of filtered images
      searchImages(debouncedSearchInput, 1);
      setSearchHistory((prevHistory) => [
        ...prevHistory,
        debouncedSearchInput.trim(),
      ]);
    } else {
      setFilteredPhotos([]);
    }
  }, [debouncedSearchInput]);

  // Update the useEffect that listens to changes in filteredImgPage
  useEffect(() => {
    if (debouncedSearchInput) {
      // Fetch more pages of filtered images
      searchImages(debouncedSearchInput, filteredImgPage);
    }
  }, [filteredImgPage, debouncedSearchInput]);

  // Fetch POPULAR images
  useEffect(() => {
    const fetchPopularPhotos = async () => {
      try {
        const response = await axios.get(API_URL, {
          params: {
            per_page: 20,
            order_by: "popular",
            page: page,
          },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        });
        console.log(response.data);

        setPopularPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
      } catch (error) {
        console.error("Error fetching popular photos:", error);
      }
    };

    fetchPopularPhotos();
  }, [page]);

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
    const scrollListener = () => handleScrollRef.current();
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

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
    const filtered = popularPhotos.filter((photo) =>
      photo.alt_description.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredPhotos(filtered);
  };

  //render inputed keywords
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword) => keyword.toLowerCase().trim()))
    );
    const word = uniqueKeywords.pop();

    setWordsArr((prevWords: any) => [...prevWords, word]);
  }, [searchHistory]);

  // Update search history
  useEffect(() => {
    const uniqueKeywords = Array.from(
      new Set(searchHistory.map((keyword) => keyword.toLowerCase().trim()))
    );

    setWordsArr(uniqueKeywords);
  }, [searchHistory]);

  //search images with rendered keywords
  const handleKeywordSearch = (e: React.MouseEvent<HTMLHeadingElement>) => {
    const keyword: string = e.currentTarget.textContent || "";
    console.log(keyword);
    setSearchInput(keyword);
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

      {/* <section>{searchHistory}</section> */}
      {wordsArr.map((word: string, index: number) => (
        <h2 onClick={handleKeywordSearch} key={index}>
          {word}
        </h2>
      ))}

      <section>
        <div className="photo-grid">
          {(searchInput === "" ? popularPhotos : filteredPhotos).map(
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
