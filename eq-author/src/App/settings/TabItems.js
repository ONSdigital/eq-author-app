import { buildSettingsPath } from "utils/UrlUtils";

const tabItems = ({ params, themeErrorCount = 0 }) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}/general`,
    enabled: true,
  },
  {
    title: `Themes, IDs, form types and legal bases`,
    url: `${buildSettingsPath(params)}/themes`,
    errorCount: themeErrorCount,
    enabled: true,
  },
];

export default tabItems;
