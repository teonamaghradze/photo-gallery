import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPhotoStatistics } from "../services/api";

function usePhotoStatistics(currentImage: string, setStatistics: Function) {
  const { data: statisticsData } = useQuery({
    queryKey: ["photoStatistics", currentImage],
    queryFn: () => fetchPhotoStatistics(currentImage),
    enabled: !!currentImage,
  });

  useEffect(() => {
    if (statisticsData) {
      setStatistics((prevStats: string[]) => ({
        ...prevStats,
        [currentImage]: statisticsData,
      }));
    }
  }, [statisticsData, currentImage, setStatistics]);

  return statisticsData;
}

export default usePhotoStatistics;
