const { last } = require("lodash");

const { SOCIAL } = require("../constants/questionnaireTypes");
const {
  types: { VOLUNTARY },
  contentMap,
} = require("../constants/legalBases");

const Section = require("./Section");
const Summary = require("./block-types/Summary");
const Confirmation = require("./block-types/Confirmation");
const Introduction = require("./block-types/Introduction");

const DEFAULT_METADATA = [
  {
    name: "user_id",
    validator: "string",
  },
  {
    name: "period_id",
    validator: "string",
  },
  {
    name: "ru_name",
    validator: "string",
  },
];

const SOCIAL_THEME = "social";
const DEFAULT_THEME = "default";
const NI_THEME = "northernireland";

const DEFAULT_METADATA_NAMES = DEFAULT_METADATA.map(({ name }) => name);

class Questionnaire {
  constructor(questionnaireJson) {
    const questionnaireId = questionnaireJson.id;
    this.eq_id = questionnaireId;
    this.form_type = questionnaireId;
    this.mime_type = "application/json/ons/eq";
    this.schema_version = "0.0.1";
    this.data_version = "0.0.2";
    this.survey_id =
      questionnaireJson.surveyId ||
      questionnaireJson.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    this.title = questionnaireJson.title;

    const ctx = this.createContext(questionnaireJson);
    this.sections = this.buildSections(questionnaireJson.sections, ctx);
    this.buildIntroduction(questionnaireJson.introduction, ctx);

    this.theme =
      questionnaireJson.type === SOCIAL ? SOCIAL_THEME : DEFAULT_THEME;

    this.theme = questionnaireJson.theme === NI_THEME ? NI_THEME : this.theme;

    this.legal_basis = this.buildLegalBasis(questionnaireJson.introduction);
    this.navigation = {
      visible: questionnaireJson.navigation,
    };
    this.metadata = this.buildMetadata(questionnaireJson.metadata);

    this.view_submitted_response = {
      enabled: true,
      duration: 900,
    };

    this.buildSummaryOrConfirmation(
      questionnaireJson.summary,
      questionnaireJson.collapsibleSummary
    );
  }

  createContext(questionnaireJson) {
    return {
      routingGotos: [],
      questionnaireJson,
    };
  }

  buildSections(sections, ctx) {
    return sections.map((section) => new Section(section, ctx));
  }

  buildSummaryOrConfirmation(summary, collapsible) {
    const finalPage = summary
      ? new Summary({ collapsible })
      : new Confirmation();
    last(this.sections).groups.push(finalPage);
  }

  buildMetadata(metadata) {
    const getValidator = (type) => {
      switch (type) {
        case "Date":
          return "date";
        case "Text_Optional":
          return "optional_string";
        default:
          return "string";
      }
    };

    const userMetadata = metadata
      .filter(({ key }) => !DEFAULT_METADATA_NAMES.includes(key))
      .map(({ key, type }) => ({
        name: key,
        validator: getValidator(type),
      }));

    return [...DEFAULT_METADATA, ...userMetadata];
  }

  buildLegalBasis(introduction) {
    if (!introduction || introduction.legalBasis === VOLUNTARY) {
      return undefined;
    }
    return contentMap[introduction.legalBasis];
  }

  buildIntroduction(introduction, ctx) {
    if (!introduction) {
      return;
    }
    const groupToAddTo = this.sections[0].groups[0];
    groupToAddTo.blocks = [
      new Introduction(introduction, ctx),
      ...groupToAddTo.blocks,
    ];
  }
}

Questionnaire.DEFAULT_METADATA = DEFAULT_METADATA;
module.exports = Questionnaire;
