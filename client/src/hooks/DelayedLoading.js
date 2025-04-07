import { useState, useEffect } from "react";

const useDelayedLoading = (loading, delay = 1000) => {
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), delay);
    } else {
      setShowLoading(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [loading, delay]);

  return showLoading;
};

export default useDelayedLoading;
