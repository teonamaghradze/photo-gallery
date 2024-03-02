import Modal from "./Modal";
import ImageCard from "../components/MainPage/ImageCard";
import "./PhotoGrid.scss";

function PhotoGrid({
  photos,
  handleImageClick,
  isOpenModal,
  currentImage,
  statistics,
}: any) {
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
