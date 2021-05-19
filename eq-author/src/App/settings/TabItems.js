import { buildSettingsPath } from "utils/UrlUtils";
import { SOCIAL } from "constants/questionnaire-types";

const tabItems = ({ params, surveyType, themeErrorCount = 0 }) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}/general`,
  },
  {
    title: `Themes, IDs, form types and legal bases`,
    url: `${buildSettingsPath(params)}/themes`,
    disabled: surveyType === SOCIAL,
    errorCount: themeErrorCount,
  },
];

export default tabItems;
