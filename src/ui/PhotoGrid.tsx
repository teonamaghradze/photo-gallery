import Modal from "./Modal";
import ImageCard from "../components/MainPage/ImageCard";
import "./PhotoGrid.scss";
import usePhotoStatistics from "../hooks/usePhotoStatistics";
import { useContext, useEffect } from "react";
import { ImagesContext } from "../context/context";
import { Photo, PhotosArray } from "../interfaces/db_interfaces";

function PhotoGrid({ photos }: PhotosArray) {
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
  const handleImageClick = (
    imageId: string,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setCurrentImage(imageId);
    setIsOpenModal((isOpen: boolean) => {
      const { target } = e;
      if (target instanceof HTMLElement) {
        const classList = target.classList; // DOMTokenList
        if (isOpen && !classList.contains("overlay")) {
          return true;
        }
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
      {photos.map((photo: Photo, index: number) => (
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
