import axios from "axios";
import { useEffect, useState } from "react";
import ImageCard from "./ImageCard";
import Modal from "../../ui/Modal";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = process.env.REACT_APP_API_KEY;

function MainPage() {
  const [popularPhotos, setPopularPhotos] = useState([]);

  const [currentImage, setCurrentImage] = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(true);

  useEffect(() => {
    const fetchPopularPhotos = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos", {
          params: {
            per_page: 20,
            order_by: "popular",
          },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        });
        setPopularPhotos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching popular photos:", error);
      }
    };

    fetchPopularPhotos();
  }, []);

  const handleImageClick = (imageId: any) => {
    setIsOpenModal((isOpen) => !isOpen);
    setCurrentImage(imageId);
  };

  return (
    <main>
      <h1>Searchbar</h1>
      <section>
        <input type="search" placeholder="search for images" />
      </section>

      <section>
        <div className="photo-grid">
          {popularPhotos.map((photo: any) => (
            <div onClick={() => handleImageClick(photo.id)} key={photo.id}>
              <img src={photo.urls.small} alt={photo.alt_description} />

              {isOpenModal && currentImage === photo.id && (
                <Modal onClose={() => setIsOpenModal(false)}>
                  <p>{photo.id}</p>
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
