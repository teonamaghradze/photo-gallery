import { useEffect, useState } from "react";

function useDebounce<T>(value: any, delay = 700) {
  const [debouncedVal, setDebouncedVal] = useState<T>(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedVal(value);
    }, delay);

    return () => clearTimeout(timeOut);
  }, [value, delay]);
  return debouncedVal;
}

export default useDebounce;
