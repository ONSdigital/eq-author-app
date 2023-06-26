const { find } = require("lodash");
const { v4: uuidv4 } = require("uuid");

const { NOTICE_1 } = require("../constants/legalBases");

module.exports = (metadata) => {
  return {
    id: uuidv4(),
    title:
      find(metadata, { key: "ru_name" })?.id &&
      find(metadata, { key: "trad_as" })?.id
        ? `<p>You are completing this for <span data-piped="metadata" data-id="${
            find(metadata, { key: "ru_name" }).id
          }">ru_name</span> (<span data-piped="metadata" data-id="${
            find(metadata, { key: "trad_as" }).id
          }">trad_as</span>)</p>`
        : "",
    contactDetailsPhoneNumber: "0300 1234 931",
    contactDetailsEmailAddress: "surveys@ons.gov.uk",
    contactDetailsEmailSubject: "Change of details",
    showOnHub: false,
    contactDetailsIncludeRuRef: true,
    additionalGuidancePanelSwitch: false,
    additionalGuidancePanel: "",
    description:
      "<ul><li>Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. </li><li>You can provide info estimates if actual figures are not available.</li><li>We will treat your data securely and confidentially.</li></ul>",
    legalBasis: NOTICE_1,
    // previewQuestions: true,
    secondaryTitle: "<p>Information you need</p>",
    secondaryDescription:
      "<p>You can select the dates of the period you are reporting for, if the given dates are not appropriate.</p>",
    collapsibles: [],
    tertiaryTitle: "<p>How we use your data</p>",
    tertiaryDescription:
      "<ul><li>You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.</li><li>The information you provide contributes to Gross Domestic Product (GDP).</li></ul>",
  };
};
