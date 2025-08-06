import { useState, useEffect } from "react";

const useDelayedLoading = (loading, delay = 500) => {
  const [showLoading, setShowLoading] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    if (loading) {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }
      setShowLoading(true);
    } else {
      // Delay hiding
      const timeout = setTimeout(() => {
        setShowLoading(false);
        setHideTimeout(null);
      }, delay);
      setHideTimeout(timeout);
    }

    return () => {
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [loading, delay]);

  return showLoading;
};

export default useDelayedLoading;
