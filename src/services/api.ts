import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchPopularPhotos = async (page: any) => {
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
        query: query,
        per_page: 20,
        page: page,
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

// export const fetchImageStatistics = async (imageId: any) => {
//   try {
//     const response = await axios.get(
//       `https://api.unsplash.com/photos/${imageId}/statistics`,
//       {
//         headers: {
//           Authorization: `Client-ID ${process.env.REACT_APP_API_KEY}`,
//         },
//       }
//     );

//     return response.data;
//   } catch (error: any) {
//     throw new Error("Error fetching image statistics:", error);
//   }
// };

export const fetchPhotoStatistics = async (photoId: any) => {
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