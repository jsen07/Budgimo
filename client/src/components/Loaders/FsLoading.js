import React from "react";

const FsLoading = () => {
  return (
    <div className="absolute h-screen w-full right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2 bg-black">
      <div className="p-4 bg-gradient-to-tr animate-spin from-green-500 to-blue-500 via-purple-500 rounded-full">
        <div className="bg-white rounded-full">
          <div className="w-24 h-24 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FsLoading;
