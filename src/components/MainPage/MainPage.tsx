import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";
import "./MainPage.scss";
import { handleScroll } from "../../services/helpers";
import { Link } from "react-router-dom";
import useDebounce from "./hooks/useDebounce";

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

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{ [id: string]: any }>({});

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce<any>(searchInput);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [wordsArr, setWordsArr] = useState<any>([]);

  useEffect(() => {
    // Fetch images based on search input
    const searchImages = async (query: string) => {
      try {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: query,
              per_page: 20,
            },
            headers: {
              Authorization: `Client-ID ${API_KEY}`,
            },
          }
        );

        setFilteredPhotos(response.data.results);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    if (debouncedSearchInput) {
      searchImages(debouncedSearchInput);
      setSearchHistory((prevHistory) => [
        ...prevHistory,
        debouncedSearchInput.trim(),
      ]);
    } else {
      setFilteredPhotos([]);
    }
  }, [debouncedSearchInput]);

  // Fetch POPULAR images
  useEffect(() => {
    const fetchPopularPhotos = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos", {
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
            `https://api.unsplash.com/photos/${currentImage}/statistics`,
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
  const handleScrollRef = useRef(handleScroll(setPage));

  useEffect(() => {
    const scrollListener = () => handleScrollRef.current();
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  //toggle modal image
  const handleImageClick = (imageId: string) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen) => !isOpen);
  };

  //find image with input search
  const handleSearch = (e: any) => {
    setSearchInput(e.target.value);
    const filtered = popularPhotos.filter((photo) =>
      photo.alt_description.toLowerCase().includes(e.target.value)
    );

    console.log(filtered);
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
    const keyword: any = e.currentTarget.textContent;
    console.log(keyword);
    setSearchInput(keyword);
  };

  return (
    <main>
      <section>
        <h1>Photo Gallery</h1>

        <div className="search-section">
          <input
            type="search"
            placeholder="Search for images"
            className="search-input"
            onChange={handleSearch}
          />
        </div>
        <Link to="/history" className="history-link">
          <h2>Go to history</h2>
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
          {searchInput === ""
            ? popularPhotos.map((photo: Photo, index: number) => (
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
                          photo={
                            popularPhotos.find((p) => p.id === currentImage)!
                          }
                          statistics={statistics[currentImage]}
                        />
                      </Modal>
                    )}
                  </div>
                </div>
              ))
            : filteredPhotos.map((photo: Photo, index: number) => (
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
                          photo={
                            popularPhotos.find((p) => p.id === currentImage)!
                          }
                          statistics={statistics[currentImage]}
                        />
                      </Modal>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
}

export default MainPage;
