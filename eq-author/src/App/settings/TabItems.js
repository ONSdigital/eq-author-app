import { buildSettingsPath } from "utils/UrlUtils";

const tabItems = (params) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}`,
  },
  {
    title: `Themes, IDs and form types`,
    url: `${buildSettingsPath(params)}/themes`,
  },
];

export default tabItems;
