const { last } = require("lodash");

const { SOCIAL } = require("../constants/questionnaireTypes");
const Section = require("./Section");
const Summary = require("./block-types/Summary");
const Confirmation = require("./block-types/Confirmation");

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
    this.theme =
      questionnaireJson.type === SOCIAL ? SOCIAL_THEME : DEFAULT_THEME;
    this.legal_basis = questionnaireJson.legalBasis;
    this.navigation = {
      visible: questionnaireJson.navigation,
    };
    this.metadata = this.buildMetadata(questionnaireJson.metadata);

    this.view_submitted_response = {
      enabled: true,
      duration: 900,
    };

    this.buildSummaryOrConfirmation(questionnaireJson.summary);
  }

  createContext(questionnaireJson) {
    return {
      routingGotos: [],
      questionnaireJson,
    };
  }

  buildSections(sections, ctx) {
    return sections.map(section => new Section(section, ctx));
  }

  buildSummaryOrConfirmation(summary) {
    const finalPage = summary ? new Summary() : new Confirmation();
    last(this.sections).groups.push(finalPage);
  }

  buildMetadata(metadata) {
    const userMetadata = metadata
      .filter(({ key }) => !DEFAULT_METADATA_NAMES.includes(key))
      .map(({ key, type }) => ({
        name: key,
        validator: type === "Date" ? "date" : "string",
      }));

    return [...DEFAULT_METADATA, ...userMetadata];
  }
}

Questionnaire.DEFAULT_METADATA = DEFAULT_METADATA;
module.exports = Questionnaire;
