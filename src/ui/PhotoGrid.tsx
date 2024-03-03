import Modal from "./Modal";
import ImageCard from "../components/MainPage/ImageCard";
import "./PhotoGrid.scss";
import usePhotoStatistics from "../hooks/usePhotoStatistics";
import { useContext, useEffect } from "react";
import { ImagesContext } from "../context/context";

function PhotoGrid({ photos }: any) {
  const {
    currentImage,
    statistics,
    setStatistics,
    isOpenModal,
    setIsOpenModal,
    setCurrentImage,
  } = useContext(ImagesContext);

  usePhotoStatistics(currentImage, setStatistics);

  //toggle modal image
  const handleImageClick = (imageId: string, e: any) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen: any) => {
      if (isOpen && !e.target.classList.contains("overlay")) {
        return true;
      }
      return !isOpen;
    });
  };

  //--------------------------------------------------------------//
  //hide scroll while modal is open
  useEffect(() => {
    if (isOpenModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpenModal]);

  return (
    <div className="photo-grid">
      {photos.map((photo: any, index: any) => (
        <div
          onClick={(e) => handleImageClick(photo.id, e)}
          key={`${photo.id}-${index}`}
        >
          <div className="img-container">
            <img src={photo.urls.small} alt={photo.alt_description} />
          </div>
          <div>
            {isOpenModal && currentImage === photo.id && (
              <Modal>
                <ImageCard photo={photo} statistics={statistics[photo.id]} />
              </Modal>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;
