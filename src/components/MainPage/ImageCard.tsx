import React from "react";

interface ImageCardProps {
  photo: {
    id: string;
    urls: {
      small: string;
    };
    alt_description: string;
    likes: string;
  };
}

const ImageCard: React.FC<ImageCardProps> = ({ photo }) => {
  return (
    <div className="image-card">
      <img src={photo.urls.small} alt={photo.alt_description} />
      <p>{photo.likes}</p>
    </div>
  );
};

export default ImageCard;
