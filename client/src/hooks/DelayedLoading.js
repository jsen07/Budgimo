import { useState, useEffect } from "react";

/**
 * Shows a loading indicator immediately when `loading` is true,
 * and keeps it visible for `delay` ms after `loading` turns false.
 */
const useDelayedLoading = (loading, delay = 500) => {
  const [showLoading, setShowLoading] = useState(false);
  const [hideTimeout, setHideTimeout] = useState(null);

  useEffect(() => {
    if (loading) {
      // Cancel any pending hide timeout
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
