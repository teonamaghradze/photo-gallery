import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchPopularPhotos = async (page: number) => {
  try {
    const response = await axios.get("https://api.unsplash.com/photos", {
      params: {
        per_page: 20,
        order_by: "popular",
        page: page,
      },
      headers: {
        Authorization: `Client-ID ${API_KEY}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching popular photos:", error);
  }
};

export const fetchSearchImages = async (query: string, page: number) => {
  try {
    const response = await axios.get(`https://api.unsplash.com/search/photos`, {
      params: {
        page: page,
        per_page: 20,
        query: query,
      },
      headers: {
        Authorization: `Client-ID ${API_KEY}`,
      },
    });

    return response.data.results;
  } catch (error: any) {
    throw new Error("Error fetching photos:", error);
  }
};

export const fetchPhotoStatistics = async (photoId: string) => {
  try {
    const response = await axios.get(
      `https://api.unsplash.com/photos/${photoId}/statistics`,
      {
        headers: {
          Authorization: `Client-ID ${API_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error fetching statistics");
  }
};
