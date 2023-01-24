import PropTypes from "prop-types";
import * as answerTypes from "constants/answer-types";

import * as metadataTypes from "constants/metadata-types";

const CustomPropTypes = {
  breadcrumb: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  questionnaire: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    theme: PropTypes.string,
    title: PropTypes.string,
    navigation: PropTypes.bool,
    shortTile: PropTypes.string,
    displayName: PropTypes.string,
  }),
  metadata: PropTypes.shape({
    id: PropTypes.string.isRequired,
    alias: PropTypes.string,
    key: PropTypes.string,
    type: PropTypes.oneOf(
      Object.values(metadataTypes).map((type) => type.value)
    ),
    languageValue: PropTypes.string,
    regionValue: PropTypes.string,
    textValue: PropTypes.string,
    dateValue: PropTypes.string,
  }),
  introduction: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    contactDetailsPhoneNumber: PropTypes.string,
    contactDetailsEmailAddress: PropTypes.string,
    additionalGuidancePanel: PropTypes.string,
    additionalGuidancePanelSwitch: PropTypes.bool,
    description: PropTypes.string,
    secondaryTitle: PropTypes.string,
    secondaryDescription: PropTypes.string,
    collapsibles: PropTypes.array,
    tertiaryTitle: PropTypes.string,
    tertiaryDescription: PropTypes.string,
  }),
  section: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    position: PropTypes.number,
    introductionTitle: PropTypes.string,
    introductionContent: PropTypes.string,
    introductionEnabled: PropTypes.bool,
  }),
  page: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    guidance: PropTypes.string,
  }),
  validationErrorInfo: PropTypes.shape({
    id: PropTypes.string,
    totalCount: PropTypes.number,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        errorCode: PropTypes.string,
        field: PropTypes.string,
        type: PropTypes.string,
      })
    ),
  }),
  answer: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.oneOf(Object.values(answerTypes)),
  }),
  option: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
    qCode: PropTypes.string,
    value: PropTypes.string,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      sectionId: PropTypes.string,
      pageId: PropTypes.string,
      tab: PropTypes.string,
    }).isRequired,
  }),
  apolloClient: PropTypes.shape({
    query: PropTypes.func.isRequired,
    readQuery: PropTypes.func.isRequired,
  }),
  store: PropTypes.shape({
    getState: PropTypes.func.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }),
  me: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }),
};

export default CustomPropTypes;
