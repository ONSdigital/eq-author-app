import { buildSettingsPath } from "utils/UrlUtils";
import { SOCIAL } from "constants/questionnaire-types";

const tabItems = (params, surveyType) => [
  {
    title: `General`,
    url: `${buildSettingsPath(params)}`,
  },
  {
    title: `Themes, IDs and form types`,
    url: `${buildSettingsPath(params)}/themes`,
    disabled: surveyType === SOCIAL,
  },
];

export default tabItems;
