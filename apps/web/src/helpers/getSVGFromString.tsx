import { ReactNode } from "react";

import CalenderIcon from "../components/Icons/CalenderIcon";
import CloseIcon from "../components/Icons/CloseIcon";
import EyeIcon from "../components/Icons/EyeIcon";
import EyeWithSlashIcon from "../components/Icons/EyeWithSlashIcon";
import Logout from "../components/Icons/Logout";
import MenuIcon from "../components/Icons/MenuIcon";
import OverviewIcon from "../components/Icons/OverviewIcon";
import SettingsIcon from "../components/Icons/SettingsIcon";

export default function getSVGFromString(
  icon: string,
  width: string | number,
  height: string | number
) {
  let response: ReactNode;
  switch (icon) {
    case "overview":
      response = <OverviewIcon width={width} height={height} />;
      break;
    case "calender":
      response = <CalenderIcon width={width} height={height} />;
      break;
    case "settings":
      response = <SettingsIcon width={width} height={height} />;
      break;
    case "logout":
      response = <Logout width={width} height={height} />;
      break;
    case "eye":
      response = <EyeIcon width={width} height={height} />;
      break;
    case "eyeWithSlash":
      response = <EyeWithSlashIcon width={width} height={height} />;
      break;
    case "menu":
      response = <MenuIcon width={width} height={height} />;
      break;
    case "close":
      response = <CloseIcon width={width} height={height} />;
      break;
    default:
      response = <OverviewIcon width={width} height={height} />;
  }

  return response;
}
