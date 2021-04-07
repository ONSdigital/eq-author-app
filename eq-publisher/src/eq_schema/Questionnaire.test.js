const { last } = require("lodash");

const { BUSINESS, SOCIAL } = require("../constants/questionnaireTypes");
const legalBases = require("../constants/legalBases");
const {
  types: { NOTICE_1, VOLUNTARY },
} = legalBases;

const Questionnaire = require("./Questionnaire");
const Summary = require("./block-types/Summary");
const Section = require("./Section");

describe("Questionnaire", () => {
  const createQuestionnaireJSON = (questionnaire) =>
    Object.assign(
      {
        id: "1",
        title: "Quarterly Business Survey",
        description: "Quarterly Business Survey",
        type: BUSINESS,
        navigation: false,
        surveyId: "0112",
        summary: true,
        sections: [
          {
            id: "1",
            title: "Section",
            folders: [
              {
                id: "f1",
                pages: [],
              },
            ],
          },
        ],
        metadata: [],
        introduction: {
          legalBasis: legalBases.types.NOTICE_1,
          collapsibles: [],
        },
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
      legal_basis:
        "Notice is given under section 1 of the Statistics of Trade Act 1947.",
      metadata: expect.arrayContaining(Questionnaire.DEFAULT_METADATA),
    });
  });

  it("should not set a legal basis when there is no introduction", () => {
    questionnaire = new Questionnaire(
      createQuestionnaireJSON({ introduction: null })
    );
    expect(questionnaire.legal_basis).toEqual(undefined);
  });

  it("should not set a legal basis when the legal basis is voluntary", () => {
    questionnaire = new Questionnaire(
      createQuestionnaireJSON({
        introduction: { legalBasis: VOLUNTARY, collapsibles: [] },
      })
    );
    expect(questionnaire.legal_basis).toEqual(undefined);
  });

  it("should set them to 'social' for unmigrated social surveys", () => {
    questionnaire = new Questionnaire(
      createQuestionnaireJSON({ type: SOCIAL })
    );
    expect(questionnaire.theme).toEqual("social");
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
            folders: [
              {
                id: "f1",
                pages: [],
              },
            ],
          },
          {
            id: "3",
            title: "Section number 3",
            folders: [
              {
                id: "f2",
                pages: [],
              },
            ],
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
        navigation: true,
        sections: [
          {
            id: "2",
            title: "<p>Section <em>number</em> 2</p>",
            folders: [
              {
                id: "f1",
                pages: [],
              },
            ],
          },
          {
            id: "3",
            title: "<p>Section <em>number</em> 3</p>",
            folders: [
              {
                id: "f2",
                pages: [],
              },
            ],
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

  it("should convert questionnaire title to a valid survey id", () => {
    const questionnaireJson = createQuestionnaireJSON({
      title: 'Questionnaire-For-Test-With-!@£$%^&*()foo+"{}',
    });
    delete questionnaireJson.surveyId;
    questionnaire = new Questionnaire(questionnaireJson);
    expect(questionnaire.survey_id).toEqual("questionnairefortestwithfoo");
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
          key: "example_optional_text",
          type: "Text_Optional",
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
        name: "example_optional_text",
        validator: "optional_string",
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

  it("should allow setting northern ireland theme (unmigrated surveys)", () => {
    const questionnaireJson = createQuestionnaireJSON({
      theme: "northernireland",
    });

    expect(new Questionnaire(questionnaireJson)).toHaveProperty(
      "theme",
      "northernireland"
    );
  });

  it("should allow setting default theme (unmigrated surveys)", () => {
    const questionnaireJson = createQuestionnaireJSON({
      theme: "default",
    });

    expect(new Questionnaire(questionnaireJson)).toHaveProperty(
      "theme",
      "default"
    );
  });

  it("should allow setting the theme and legal basis according to the previewTheme", () => {
    const eqId = "my-custom-eqId";
    const formType = "my-custom-formtype";
    const shortName = "census";
    const legalBasis = NOTICE_1;

    const questionnaireJson = createQuestionnaireJSON({
      previewTheme: shortName,
      themes: [
        {
          id: "mcthemeface1",
          shortName,
          legalBasis,
          eqId,
          formType,
        },
      ],
    });

    expect(new Questionnaire(questionnaireJson)).toEqual(
      expect.objectContaining({
        theme: shortName,
        eq_id: eqId,
        form_type: formType,
        legal_basis: legalBases[legalBasis],
      })
    );
  });
});
