import React, { useContext } from "react";
import ImagesContext from "../../context/context";

function Searchbar({ imagesData }: any) {
  const { setSearchInput, setFilteredPhotos } = useContext(ImagesContext);

  //find image with input search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchInput(e.target.value);
    const filtered = imagesData.filter((photo: any) =>
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
