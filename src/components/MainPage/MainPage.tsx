import axios from "axios";
import { useEffect, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";
import "./MainPage.scss";

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
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

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

  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpenModal]);

  const handleScroll = () => {
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    const scrolledToBottom =
      Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleImageClick = (imageId: string) => {
    setIsOpenModal((isOpen) => !isOpen);
    setCurrentImage(imageId);
  };

  const handleSearch = (e: any) => {
    console.log(e.target.value);
  };

  return (
    <main>
      <h1>Searchbar</h1>
      <section>
        <input
          type="search"
          placeholder="search for images"
          onChange={(e) => handleSearch(e)}
        />
      </section>

      <section>
        <div className="photo-grid">
          {popularPhotos.map((photo: Photo, index: number) => (
            <div
              onClick={() => handleImageClick(photo.id)}
              key={`${photo.id}-${index}`}
            >
              <div className="img-container">
                <img src={photo.urls.small} alt={photo.alt_description} />
              </div>
              {isOpenModal && currentImage === photo.id && (
                <Modal>
                  <ImageCard photo={photo} />
                </Modal>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MainPage;
