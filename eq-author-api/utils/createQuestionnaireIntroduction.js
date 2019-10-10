const { find } = require("lodash");
const uuid = require("uuid").v4;

const { NOTICE_1 } = require("../constants/legalBases");

module.exports = metadata => {
  return {
    id: uuid.v4(),
    title: `<p>You are completing this for <span data-piped="metadata" data-id="${
      find(metadata, { key: "trad_as" }).id
    }">trad_as</span> (<span data-piped="metadata" data-id="${
      find(metadata, { key: "ru_name" }).id
    }">ru_name</span>)</p>`,
    description:
      "<ul><li>Data should relate to all sites in England, Scotland, Wales and Northern Ireland unless otherwise stated. </li><li>You can provide info estimates if actual figures aren’t available.</li><li>We will treat your data securely and confidentially.</li></ul>",
    legalBasis: NOTICE_1,
    secondaryTitle: "<p>Information you need</p>",
    secondaryDescription:
      "<p>You can select the dates of the period you are reporting for, if the given dates are not appropriate.</p>",
    collapsibles: [],
    tertiaryTitle: "<p>How we use your data</p>",
    tertiaryDescription:
      "<ul><li>You cannot appeal your selection. Your business was selected to give us a comprehensive view of the UK economy.</li><li>The information you provide contributes to Gross Domestic Product (GDP).</li></ul>",
  };
};
