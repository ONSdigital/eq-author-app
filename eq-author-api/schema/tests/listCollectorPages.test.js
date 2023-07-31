const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire/createQuestionnaire");

const {
  createListCollectorFolder,
} = require("../../tests/utils/contextBuilder/folder");

const { queryPage } = require("../../tests/utils/contextBuilder/page");

describe("List collector pages", () => {
  let ctx = {};
  let config = {};
  let questionnaire = {};

  beforeEach(async () => {
    ctx = await buildContext({ comments: [] });

    config = {
      title: "Test questionnaire",
      description: "Questionnaire description",
      surveyId: "123",
      theme: "business",
      navigation: false,
      summary: false,
      shortTitle: "",
    };

    questionnaire = await createQuestionnaire(ctx, config);
  });

  describe("Qualifier page", () => {
    it("should resolve qualifier page", async () => {
      const [section] = questionnaire.sections;
      const listCollectorFolder = await createListCollectorFolder(ctx, {
        sectionId: section.id,
        position: 0,
      });

      expect(listCollectorFolder.pages[0].pageType).toEqual(
        "ListCollectorQualifierPage"
      );

      const qualifierPage = listCollectorFolder.pages[0];

      const comments = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];
      ctx.comments[qualifierPage.id] = comments;

      const queriedPage = await queryPage(ctx, qualifierPage.id);

      expect(queriedPage).toMatchObject({
        section: {
          id: questionnaire.sections[0].id,
          allowRepeatingSection: true,
        },
        folder: { id: listCollectorFolder.id },
        position: 0,
        displayName: "Untitled qualifier question",
        comments,
        validationErrorInfo: {
          errors: [
            {
              id: expect.any(String),
              type: "page",
              field: "title",
              errorCode: "ERR_VALID_REQUIRED",
            },
            {
              id: expect.any(String),
              type: "page",
              field: "pageDescription",
              errorCode: "PAGE_DESCRIPTION_MISSING",
            },
          ],
        },
      });
    });
  });
});
