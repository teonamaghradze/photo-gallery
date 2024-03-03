export interface PhotosArray {
  photos: Photo[];
}

export interface SearchbarProps {
  imagesData: Photo[];
}

export interface ImagesArray {
  photo: Photo;
  statistics?: {
    views?: {
      total: number;
    };
    downloads?: {
      total: number;
    };
  };
}

export interface Photo {
  id: string;
  urls: {
    small: string;
    full: string;
  };
  alt_description: string;
  likes: number;
}
