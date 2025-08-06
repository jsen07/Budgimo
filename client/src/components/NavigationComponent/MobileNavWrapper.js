import { useLocation } from "react-router-dom";
import MobileNav from "./MobileNav";

const MobileNavWrapper = () => {
  const location = useLocation();
  const routesWithMobileNav = [
    "/dashboard",
    "/transactions",
    "/schedule",
    "/analytics",
  ];

  const show = routesWithMobileNav.includes(location.pathname);

  return show ? (
    <div className="block lg:hidden fixed bottom-0 w-full z-50">
      <MobileNav />
    </div>
  ) : null;
};

export default MobileNavWrapper;
