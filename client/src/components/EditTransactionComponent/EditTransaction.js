import React from "react";
import { useNavigate } from "react-router-dom";
import MobileNav from "../NavigationComponent/MobileNav";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";

const EditTransaction = ({ expense }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col font-sans items-center pb-[100px]">
      <div className="sticky top-0 w-full flex flex-col pt-8 bg-white">
        <div className="flex flex-row justify-between items-center text-2xl px-2 relative">
          <ArrowBackIosRoundedIcon onClick={() => navigate("/transactions")} />
          <h1 className="font-semibold tracking-wide absolute left-1/2 -translate-x-1/2">
            {" "}
            Edit transaction{" "}
          </h1>
        </div>
      </div>
      <MobileNav />
    </div>
  );
};

export default EditTransaction;
