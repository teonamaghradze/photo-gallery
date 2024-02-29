interface ImageCardProps {
  photo: any;
  statistics?: {
    views?: {
      total: number;
    };
    downloads?: {
      total: number;
    };
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ photo, statistics }) => {
  const viewsTotal = statistics?.views?.total || 0;
  const downloadsTotal = statistics?.downloads?.total || 0;

  return (
    <div className="image-card">
      <img src={photo.urls.small} alt={photo.alt_description} />
      <div className="statistics">
        <p>Likes: {photo.likes}</p>
        <p>Views: {viewsTotal}</p>
        <p>Downloads: {downloadsTotal}</p>
      </div>
    </div>
  );
};

export default ImageCard;
