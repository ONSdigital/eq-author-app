import { buildSettingsPath } from "utils/UrlUtils";

const tabItems = (params, surveyType) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}`,
  },
  {
    title: `Themes, IDs and form types`,
    url: `${buildSettingsPath(params)}/themes`,
    disabled: surveyType === "Social",
  },
];

export default tabItems;
