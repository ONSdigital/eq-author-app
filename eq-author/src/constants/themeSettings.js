import { enableOn } from "utils/featureFlags";

export const THEME_TITLES = {
  default: "GB theme",
  northernireland: "NI theme",
  covid: !enableOn(["removedThemes"]) && "COVID theme",
  epe: !enableOn(["removedThemes"]) && "EPE theme",
  epenorthernireland: !enableOn(["removedThemes"]) && "EPE NI theme",
  ukis: "UKIS theme",
  ukis_ni: "UKIS NI theme", //eslint-disable-line
  orr: "Office of Rail and Road theme",
};
