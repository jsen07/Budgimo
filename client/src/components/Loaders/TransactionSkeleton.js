import React, { useEffect, useRef, useState } from "react";

const TransactionSkeleton = () => {
  const [skeletons, setSkeletons] = useState(0);
  const containerRef = useRef(null);
  const skeletonRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && skeletonRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const skeletonHeight = skeletonRef.current.clientHeight;
      const count = Math.floor(containerHeight / skeletonHeight);
      setSkeletons(count);

      // Disable scrolling
      document.body.style.overflow = "hidden";

      // Re-enable on unmount
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, []);

  return (
    <div className="h-full flex flex-col grow gap-1" ref={containerRef}>
      {/* Hidden skeleton for measuring height */}
      <div className="invisible absolute" ref={skeletonRef}>
        <div className="mx-auto min-w-full max-w-sm rounded-md p-4 bg-neutral-500">
          <div className="flex space-x-4">
            <div className="size-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3 flex flex-row items-center justify-center h-full">
                <div className="h-2 rounded bg-gray-200 flex grow animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render actual skeletons */}
      {[...Array(skeletons)].map((_, i) => (
        <div
          key={i}
          className="mx-auto min-w-full max-w-sm rounded-md p-4 bg-neutral-500 animate-fadeInOut"
        >
          <div className="flex space-x-4">
            <div className="size-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="space-y-3 flex flex-row items-center justify-center h-full">
                <div className="h-2 rounded bg-gray-200 flex grow animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSkeleton;
