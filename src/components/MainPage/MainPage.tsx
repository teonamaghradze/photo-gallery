import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";
import "./MainPage.scss";
import { handleScroll } from "../../services/helpers";

const API_URL = "https://api.unsplash.com/search/photos";
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
  const [page, setPage] = useState<number>(1);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{ [id: string]: any }>({});

  //INFINITE SCROLL
  const handleScrollRef = useRef(handleScroll(setPage));

  useEffect(() => {
    const scrollListener = () => handleScrollRef.current();
    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  //Fetch POPULAR images
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

  //toggle modal image
  const handleImageClick = (imageId: string) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen) => !isOpen);
  };

  return (
    <main>
      <h1>Searchbar</h1>
      <section>
        <input type="search" placeholder="search for images" />
      </section>

      <section>
        <div className="photo-grid">
          {popularPhotos.map((photo: Photo, index: number) => (
            <div
              onClick={() => handleImageClick(photo.id)}
              //for 'Encountered two children with the same key' problem
              key={`${photo.id}-${index}`}
            >
              <div className="img-container">
                <img src={photo.urls.small} alt={photo.alt_description} />
              </div>

              <div>
                {isOpenModal && currentImage === photo.id && (
                  <Modal>
                    {/* <ImageCard photo={photo} /> */}
                    <ImageCard
                      photo={
                        popularPhotos.find(
                          (photo) => photo.id === currentImage
                        )!
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
