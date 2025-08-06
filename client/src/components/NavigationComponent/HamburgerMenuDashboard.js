import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import NavigationBar from "./NavigationBar";

const HamburgerMenuDashboard = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <div className="hidden lg:flex 2xl:hidden text-4xl text-neutral-800">
        <button
          onClick={() => {
            setToggleMenu((prev) => !prev);
          }}
        >
          <MenuIcon fontSize="inherit" />
        </button>
        {toggleMenu && <NavigationBar setToggleMenu={setToggleMenu} />}
      </div>
    </>
  );
};

export default HamburgerMenuDashboard;
