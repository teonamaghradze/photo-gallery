interface Photo {
  id: string;
  urls: {
    small: string;
  };
  alt_description: string;
}

interface ImageCardProps {
  photo: Photo;
}

const ImageCard: React.FC<ImageCardProps> = ({ photo }) => {
  return (
    <div>
      <img src={photo.urls.small} key={photo.id} alt={photo.alt_description} />
    </div>
  );
};
export default ImageCard;
