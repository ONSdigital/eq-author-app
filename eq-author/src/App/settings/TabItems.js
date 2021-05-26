import { buildSettingsPath } from "utils/UrlUtils";
import { SOCIAL } from "constants/questionnaire-types";

const tabItems = ({ params, type, themeErrorCount = 0 }) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}/general`,
  },
  {
    title: `Themes, IDs, form types and legal bases`,
    url: `${buildSettingsPath(params)}/themes`,
    disabled: type === SOCIAL,
    errorCount: themeErrorCount,
  },
];

export default tabItems;
