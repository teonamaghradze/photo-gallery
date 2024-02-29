import axios from "axios";
import { useEffect, useState } from "react";

function useFetch(apiUrl: string, params: any, headers: any) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl, { params, headers });
        setData(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, params, headers]);

  return { data, loading, error };
}

export default useFetch;
