import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";

import NavigationLinks from "./NavigationLinks";

const NavigationBar = ({ setToggleMenu, firstName, LastName }) => {
  return (
    <div className="fixed w-80 transition-all flex flex-col top-0 left-0 bg-neutral-800 h-screen text-white z-20">
      <div className="w-full flex justify-between items-center py-4 px-6 font-sans 2xl:hidden">
        <button
          className="text-4xl"
          onClick={() => setToggleMenu((prev) => !prev)}
        >
          <MenuOpenRoundedIcon fontSize="inherit" />
        </button>
      </div>

      {/* NAVIGATION LINKS */}
      <NavigationLinks firstName={firstName} LastName={LastName} />
    </div>
  );
};

export default NavigationBar;
