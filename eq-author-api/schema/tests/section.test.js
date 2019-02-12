const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { get, last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  updateSection,
  querySection,
} = require("../../tests/utils/questionnaireBuilder/section");

const { NUMBER } = require("../../constants/answerTypes");

describe("section", () => {
  let questionnaire, metadata, section;
  let config = {
    metadata: [{}],
    sections: [
      {
        title: "title-1",
        alias: "alias-1",
        position: 0,
        pages: [
          {
            title: "page-1",
            answers: [
              {
                type: NUMBER,
              },
            ],
          },
        ],
      },
      {
        title: "title-2",
        alias: "alias-2",
        position: 1,
        introduction: {},
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    metadata = questionnaire.metadata;
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a section", () => {
      expect(section).toEqual(
        expect.objectContaining(
          filter(
            gql`
              {
                title
                alias
                position
              }
            `,
            last(config.sections)
          )
        )
      );
    });

    it("should create one page", () => {
      expect(section.pages).toHaveLength(1);
    });
  });

  describe("mutate", () => {
    let updatedSection;
    let update;
    beforeEach(async () => {
      update = {
        id: section.id,
        title: "Questionnaire-updated",
        alias: "Alias-updated",
      };
      updatedSection = await updateSection(questionnaire, update);
    });

    it("should mutate a section", () => {
      expect(updatedSection).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedSection;

    beforeEach(async () => {
      queriedSection = await querySection(questionnaire, section.id);
    });

    it("should resolve section fields", () => {
      expect(queriedSection).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        pages: expect.any(Array),
        questionnaire: expect.any(Object),
        introduction: expect.any(Object),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should resolve questionnaire", () => {
      expect(queriedSection.questionnaire.id).toEqual(questionnaire.id);
    });

    it("should resolve introduction", () => {
      expect(queriedSection.introduction.id).toEqual(section.id);
    });

    it("should resolve availablePipingAnswers", () => {
      expect(last(queriedSection.availablePipingAnswers).id).toEqual(
        get(questionnaire, "sections[1].pages[1].answers[0].id")
      );
    });

    it("should resolve availablePipingMetadata", () => {
      expect(queriedSection.availablePipingMetadata.id).toEqual(metadata.id);
    });
  });
});
