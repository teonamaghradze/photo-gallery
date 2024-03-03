import { ImagesArray } from "../../interfaces/db_interfaces";
import "./ImageCard.scss";

const ImageCard = ({ photo, statistics }: ImagesArray) => {
  const viewsTotal = statistics?.views?.total || 0;
  const downloadsTotal = statistics?.downloads?.total || 0;

  return (
    <div className="image-card">
      <img
        src={photo?.urls?.small || photo?.urls?.full}
        alt={photo?.alt_description}
      />
      <div className="statistics-text">
        <h2>{photo?.alt_description}</h2>

        <div className="statistics">
          <div>
            <h3>{photo?.likes}</h3>
            <p>Likes</p>
          </div>

          <div>
            <h3>{viewsTotal}</h3>
            <p>Views</p>
          </div>

          <div>
            <h3>{downloadsTotal}</h3>
            <p>Downloads</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
