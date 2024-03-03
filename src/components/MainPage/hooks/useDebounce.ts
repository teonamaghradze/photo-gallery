import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay = 700): T {
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
