import { buildSettingsPath } from "utils/UrlUtils";

const tabItems = ({ params, themeErrorCount = 0 }) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}/general`,
  },
  {
    title: `Themes, IDs, form types and legal bases`,
    url: `${buildSettingsPath(params)}/themes`,
    errorCount: themeErrorCount,
  },
];

export default tabItems;
