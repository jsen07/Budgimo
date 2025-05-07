import FastfoodRoundedIcon from "@mui/icons-material/FastfoodRounded";
import CommuteRoundedIcon from "@mui/icons-material/CommuteRounded";
import MovieIcon from "@mui/icons-material/Movie";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

const categoryIcons = [
  {
    name: "Food",
    icon: <FastfoodRoundedIcon className="text-orange-500" />,
  },
  {
    name: "Transport",
    icon: <CommuteRoundedIcon className="text-blue-600" />,
  },
  { name: "Entertainment", icon: <MovieIcon className="text-purple-500" /> },
  { name: "Housing", icon: <HomeRoundedIcon className="text-stone-600" /> },
  {
    name: "Utilities",
    icon: <FlashOnRoundedIcon className="text-yellow-400" />,
  },
  { name: "Custom", icon: <CategoryRoundedIcon className="text-white" /> },
];

export default categoryIcons;
