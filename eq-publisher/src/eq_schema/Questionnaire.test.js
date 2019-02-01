/* eslint-disable camelcase */
const Questionnaire = require("./Questionnaire");
const Summary = require("./block-types/Summary");
const Section = require("./Section");
const { last, kebabCase } = require("lodash");

describe("Questionnaire", () => {
  const createQuestionnaireJSON = questionnaire =>
    Object.assign(
      {
        id: "1",
        title: "Quarterly Business Survey",
        description: "Quarterly Business Survey",
        theme: "default",
        legalBasis: "StatisticsOfTradeAct",
        navigation: false,
        surveyId: "0112",
        summary: true,
        sections: [
          {
            id: "1",
            title: "Section",
            pages: [],
          },
        ],
        metadata: [],
      },
      questionnaire
    );

  let questionnaire;

  beforeEach(() => {
    questionnaire = new Questionnaire(createQuestionnaireJSON());
  });

  it("should build valid runner meta info", () => {
    expect(questionnaire).toMatchObject({
      mime_type: "application/json/ons/eq",
      schema_version: "0.0.1",
      data_version: "0.0.2",
      survey_id: "0112",
      title: "Quarterly Business Survey",
      theme: "default",
      sections: [expect.any(Section)],
      legal_basis: "StatisticsOfTradeAct",
      metadata: expect.arrayContaining(Questionnaire.DEFAULT_METADATA),
    });
  });

  it("should add a Summary to end of Questionnaire", () => {
    const questionnaire = new Questionnaire(createQuestionnaireJSON());
    const finalSection = last(questionnaire.sections);
    const finalGroup = last(finalSection.groups);

    expect(finalGroup).toBeInstanceOf(Summary);
  });

  it("should include form_type and eq_id", () => {
    const questionnaireId = createQuestionnaireJSON().id;
    expect(questionnaire).toMatchObject({
      eq_id: questionnaireId,
      form_type: questionnaireId,
    });
  });

  it("should include view_submitted_response", () => {
    expect(questionnaire).toMatchObject({
      view_submitted_response: {
        enabled: true,
        duration: 900,
      },
    });
  });

  it("should build navigation", () => {
    const questionnaire = new Questionnaire(
      createQuestionnaireJSON({
        navigation: true,
        sections: [
          {
            id: "2",
            title: "Section number 2",
            pages: [],
          },
          {
            id: "3",
            title: "Section number 3",
            pages: [],
          },
        ],
      })
    );

    expect(questionnaire).toMatchObject({
      navigation: {
        visible: true,
      },
      sections: [
        {
          id: "section2",
        },
        {
          id: "section3",
        },
      ],
    });
  });

  it("should strip out HTML from navigation sections", () => {
    const questionnaire = new Questionnaire(
      createQuestionnaireJSON({
        sections: [
          {
            id: "2",
            title: "<p>Section <em>number</em> 2</p>",
            pages: [],
          },
          {
            id: "3",
            title: "<p>Section <em>number</em> 3</p>",
            pages: [],
          },
        ],
      })
    );

    expect(questionnaire).toMatchObject({
      sections: [
        {
          id: "section2",
          title: "Section number 2",
        },
        {
          id: "section3",
          title: "Section number 3",
        },
      ],
    });
  });

  it("should use the questionnaire title in the absence of surveyId", () => {
    const questionnaireJson = createQuestionnaireJSON();
    delete questionnaireJson.surveyId;
    questionnaire = new Questionnaire(questionnaireJson);
    expect(questionnaire.survey_id).toEqual(kebabCase(questionnaireJson.title));
  });

  it("should add a summary page if toggled on", () => {
    const questionnaire = new Questionnaire(
      createQuestionnaireJSON({
        summary: true,
      })
    );
    const lastSection = last(questionnaire.sections);
    const lastGroup = last(lastSection.groups);
    expect(lastGroup).toBeInstanceOf(Summary);
  });

  it("should add a confirmation page if summary is toggled off", () => {
    const questionnaire = new Questionnaire(
      createQuestionnaireJSON({
        summary: false,
      })
    );
    const lastSection = last(questionnaire.sections);
    const lastGroup = last(lastSection.groups);
    expect(last(lastGroup.blocks).type).toEqual("Confirmation");
  });

  it("should build the default metadata", () => {
    expect(questionnaire).toMatchObject({
      metadata: [
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
      ],
    });
  });

  it("should add user defined metadata", () => {
    const questionnaireJson = createQuestionnaireJSON({
      metadata: [
        {
          key: "example_date",
          type: "Date",
        },
        {
          key: "example_text",
          type: "Text",
        },
        {
          key: "example_region",
          type: "Region",
        },
        {
          key: "example_language",
          type: "Language",
        },
      ],
    });

    expect(new Questionnaire(questionnaireJson)).toHaveProperty("metadata", [
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
      {
        name: "example_date",
        validator: "date",
      },
      {
        name: "example_text",
        validator: "string",
      },
      {
        name: "example_region",
        validator: "string",
      },
      {
        name: "example_language",
        validator: "string",
      },
    ]);
  });

  it("should not overwrite the default metadata", () => {
    const questionnaireJson = createQuestionnaireJSON({
      metadata: [
        {
          key: "ru_name",
          type: "Date",
        },
      ],
    });

    expect(new Questionnaire(questionnaireJson)).toHaveProperty("metadata", [
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
    ]);
  });
});
