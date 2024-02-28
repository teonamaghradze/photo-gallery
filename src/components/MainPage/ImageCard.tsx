interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
  likes: string;
}

interface ImageCardProps {
  photo: Photo;
}

const ImageCard: React.FC<ImageCardProps> = ({ photo }) => {
  return (
    <div>
      <img src={photo.urls.small} key={photo.id} alt={photo.alt_description} />
      <h1>{photo.likes}</h1>
    </div>
  );
};
export default ImageCard;
