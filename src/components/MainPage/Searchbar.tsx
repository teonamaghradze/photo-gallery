import React, { useContext } from "react";
import ImagesContext from "../../context/context";
import { Photo, SearchbarProps } from "../../interfaces/db_interfaces";

function Searchbar({ imagesData }: SearchbarProps) {
  const { setSearchInput, setFilteredPhotos } = useContext(ImagesContext);

  //find image with input search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const filtered = imagesData.filter((photo: Photo) =>
      photo.alt_description.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredPhotos(filtered);
  };

  return (
    <div className="search-section">
      <input
        type="search"
        placeholder="🔎  Search for images "
        className="search-input"
        onChange={handleSearch}
      />
    </div>
  );
}

export default Searchbar;
