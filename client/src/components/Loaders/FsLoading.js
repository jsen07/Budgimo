import React from "react";

const FsLoading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50">
      <div className="w-[120px] h-[120px] border-[10px] rounded-full border-t-[10px] border-t-teal-600 animate-spin">
        {/* The text can go outside the spinning loader */}
      </div>
      {/* <h1 className="absolute text-md text-teal-600 mt-2">Loading ...</h1> */}
    </div>
  );
};

export default FsLoading;
