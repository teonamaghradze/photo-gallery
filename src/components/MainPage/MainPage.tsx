import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageCard from "./ImageCard";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = process.env.REACT_APP_API_KEY;

function MainPage() {
  const [popularPhotos, setPopularPhotos] = useState([]);

  useEffect(() => {
    const fetchPopularPhotos = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/photos", {
          params: {
            per_page: 20,
            order_by: "popular",
          },
          headers: {
            Authorization: `Client-ID ${API_KEY}`,
          },
        });
        setPopularPhotos(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching popular photos:", error);
      }
    };

    fetchPopularPhotos();
  }, []);

  return (
    <main>
      <h1>Searchbar</h1>
      <section>
        <input
          // onChange={handleSearch}
          type="search"
          placeholder="search for images"
        />
      </section>

      <section>
        <div className="photo-grid">
          {popularPhotos.map((photo: any) => (
            <ImageCard photo={photo} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default MainPage;
