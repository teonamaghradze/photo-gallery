import React, { useEffect } from "react";

const API_URL = "https://api.unsplash.com/search/photos";
const API_KEY = process.env.REACT_APP_API_KEY;

function MainPage() {
  useEffect(() => {
    // You can use the API key here
    console.log(API_KEY);
  }, []);

  return <div>Main Page</div>;
}

export default MainPage;
