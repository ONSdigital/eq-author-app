const { last, findIndex, find } = require("lodash");

jest.mock("node-fetch");
const fetch = require("node-fetch");

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => ({
      questionnaireId: "test",
      publishedSurveyUrl: "https://best.url.ever.com",
    }),
  })
);

const { SOCIAL, BUSINESS } = require("../../constants/questionnaireTypes");
const {
  PUBLISHED,
  UNPUBLISHED,
  AWAITING_APPROVAL,
  UPDATES_REQUIRED,
} = require("../../constants/publishStatus");

const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  createQuestionnaire,
  queryQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  listQuestionnaires,
  publishQuestionnaire,
  reviewQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  createAnswer,
  updateAnswer,
} = require("../../tests/utils/contextBuilder/answer");
const { NUMBER } = require("../../constants/answerTypes");

const defaultUser = require("../../tests/utils/mockUserPayload");
const { createUser } = require("../../db/datastore");

describe("questionnaire", () => {
  let ctx, questionnaire;
  const surveyId = "123";
  const surveyVersion = "1";

  afterEach(async () => {
    if (!questionnaire) {
      return;
    }

    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("create", () => {
    let config;
    beforeEach(async () => {
      ctx = buildContext(null);
      config = {
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        navigation: false,
        summary: false,
        type: SOCIAL,
        shortTitle: "short title",
      };
      ctx = { user: defaultUser() };
      createUser(ctx.user);
    });

    it("should create a questionnaire with a section and page", async () => {
      const questionnaire = await createQuestionnaire(ctx, config);
      expect(questionnaire).toEqual(
        expect.objectContaining({ ...config, displayName: "short title" })
      );

      expect(questionnaire.sections[0].folders[0].pages[0]).not.toBeNull();
    });

    it("should create a questionnaire with no metadata when creating a social survey", async () => {
      const questionnaire = await createQuestionnaire(ctx, config);
      expect(questionnaire.metadata).toEqual([]);
    });

    it("should create a questionnaire with default business metadata when creating a business survey", async () => {
      const questionnaire = await createQuestionnaire(ctx, {
        ...config,
        type: BUSINESS,
      });
      expect(questionnaire.metadata).toHaveLength(5);
    });

    it("should create a questionnaire introduction for business surveys", async () => {
      const questionnaire = await createQuestionnaire(ctx, {
        ...config,
        type: BUSINESS,
      });
      expect(questionnaire.introduction).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        collapsibles: [],
      });
    });
  });

  describe("mutate", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        summary: false,
        description: "description",
        sections: [{}],
        metadata: [{}],
      });
    });
    it("should mutate a questionnaire", async () => {
      ctx = await buildContext({
        title: "Questionnaire",
        description: "Description",
        surveyId: "1",
        theme: "default",
        navigation: false,
        summary: false,
        metadata: [{}],
        shortTitle: "short title",
      });
      const update = {
        id: ctx.questionnaire.id,
        title: "Questionnaire-updated",
        description: "Description-updated",
        theme: "census",
        navigation: true,
        surveyId: "2-updated",
        summary: true,
        shortTitle: "short title updated",
      };
      const updatedQuestionnaire = await updateQuestionnaire(ctx, update);

      expect(updatedQuestionnaire).toEqual(expect.objectContaining(update));
    });

    it("should derive display name from short title and then title", async () => {
      ctx = await buildContext({
        title: "title",
      });
      const queriedTitleQuestionnaire = await queryQuestionnaire(ctx);
      expect(queriedTitleQuestionnaire.displayName).toEqual("title");
      await updateQuestionnaire(ctx, {
        id: ctx.questionnaire.id,
        shortTitle: "short title",
      });
      const queriedShortTitleQuestionnaire = await queryQuestionnaire(ctx);
      expect(queriedShortTitleQuestionnaire.displayName).toEqual("short title");
    });

    describe("publishing and reviewing questionnaire", () => {
      beforeEach(() => {
        ctx.questionnaire.publishDetails = [
          {
            surveyId,

            formType: "321",
            variants: [
              {
                language: "en",
                theme: "default",
              },
            ],
          },
        ];
        ctx.user.admin = true;
      });

      it("should be able to submit a questionnaire for approval", async () => {
        expect(ctx.questionnaire.publishStatus).toEqual(UNPUBLISHED);
        await publishQuestionnaire(
          {
            questionnaireId: ctx.questionnaire.id,
            surveyId,
            variants: [{ theme: "ONS", formType: "456" }],
          },
          ctx
        );
        expect(ctx.questionnaire.publishStatus).toEqual(AWAITING_APPROVAL);
      });

      it("should reject if a form type is omitted", async () => {
        expect(ctx.questionnaire.publishStatus).toEqual(UNPUBLISHED);
        await expect(
          publishQuestionnaire(
            {
              questionnaireId: ctx.questionnaire.id,
              surveyId,
              variants: [{ theme: "ONS", formType: null }],
            },
            ctx
          )
        ).rejects.toBeTruthy();
      });

      it("should be able to approve a questionnaire awaiting approval", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;
        const result = await reviewQuestionnaire(
          {
            questionnaireId: ctx.questionnaire.id,
            reviewAction: "Approved",
          },
          ctx
        );

        expect(ctx.questionnaire.publishStatus).toEqual(PUBLISHED);
        expect(fetch).toHaveBeenCalledWith(
          `${process.env.SURVEY_REGISTER_URL}`,
          {
            method: "put",
            body: JSON.stringify({
              questionnaireId: ctx.questionnaire.id,
              surveyVersion,
              publishDetails: [
                {
                  surveyId,
                  formType: "321",
                  variants: [{ language: "en", theme: "default" }],
                },
              ],
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        expect(result).toMatchObject({
          id: ctx.questionnaire.id,
          publishStatus: "Published",
        });
      });

      it("should not be able to edit questionnaire while awaiting approval", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;
        const update = {
          id: ctx.questionnaire.id,
          title: "Questionnaire-updated",
        };
        await expect(updateQuestionnaire(ctx, update)).rejects.toBeTruthy();
        expect(ctx.questionnaire.title).toEqual("Questionnaire");
      });

      it("should only be possible to review questionnaire while awaiting approval", async () => {
        ctx.questionnaire.publishStatus = UNPUBLISHED;
        await expect(
          reviewQuestionnaire(
            {
              questionnaireId: ctx.questionnaire.id,
              reviewAction: "Approved",
            },
            ctx
          )
        ).rejects.toBeTruthy();
        expect(ctx.questionnaire.publishStatus).toEqual(UNPUBLISHED);
      });

      it("should only allow users with admin access to review a questionnaire", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;
        ctx.user.admin = false;

        await expect(
          reviewQuestionnaire(
            {
              questionnaireId: ctx.questionnaire.id,
              reviewAction: "Approved",
            },
            ctx
          )
        ).rejects.toBeTruthy();
        expect(ctx.questionnaire.publishStatus).toEqual(AWAITING_APPROVAL);
      });

      it("should be able to reject a questionnaire awaiting approval", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;
        await reviewQuestionnaire(
          {
            questionnaireId: ctx.questionnaire.id,
            reviewAction: "Rejected",
            reviewComment: "Ooga booga OOK OOK!",
          },
          ctx
        );

        expect(ctx.questionnaire.publishStatus).toEqual(UPDATES_REQUIRED);
      });

      it("should throw an error if a reject comment has not been given when rejecting", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;

        await expect(
          reviewQuestionnaire(
            {
              questionnaireId: ctx.questionnaire.id,
              reviewAction: "Rejected",
            },
            ctx
          )
        ).rejects.toBeTruthy();
      });

      it("should throw error if adding questionnaire to register fails", async () => {
        ctx.questionnaire.publishStatus = AWAITING_APPROVAL;
        fetch.mockImplementation(() => Promise.reject());

        await expect(
          reviewQuestionnaire(
            {
              questionnaireId: ctx.questionnaire.id,
              reviewAction: "Approved",
            },
            ctx
          )
        ).rejects.toBeTruthy();

        expect(ctx.questionnaire.publishStatus).toEqual(AWAITING_APPROVAL);
      });
    });
  });

  describe("query", () => {
    let queriedQuestionnaire;

    beforeEach(async () => {
      ctx = await buildContext({
        summary: false,
        description: "description",
        sections: [{}],
        metadata: [{}],
      });
      queriedQuestionnaire = await queryQuestionnaire(ctx);
    });

    it("should resolve questionnaire fields", () => {
      expect(queriedQuestionnaire).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        theme: expect.any(String),
        navigation: expect.any(Boolean),
        surveyId: expect.any(String),
        createdAt: expect.any(String),
        createdBy: expect.any(Object),
        sections: expect.any(Array),
        summary: expect.any(Boolean),
        questionnaireInfo: expect.any(Object),
        metadata: expect.any(Array),
        editors: expect.any(Array),
        permission: expect.any(String),
        totalErrorCount: expect.any(Number),
      });
    });

    it("should resolve createdBy", () => {
      expect(queriedQuestionnaire.createdBy.displayName).toMatch(ctx.user.name);
    });

    it("should resolve section", () => {
      expect(queriedQuestionnaire.sections.id).toEqual(
        ctx.questionnaire.sections.id
      );
    });

    it("should resolve questionnaireInfo", () => {
      expect(queriedQuestionnaire.questionnaireInfo.totalSectionCount).toEqual(
        1
      );
    });

    it("should resolve metadata", () => {
      expect(last(queriedQuestionnaire.metadata).id).toEqual(
        last(ctx.questionnaire.metadata).id
      );
    });

    it("should resolve ValidationErrorInfo", async () => {
      const questionnaireValidationErrors = {
        errors: ["error1"],
      };

      ctx = {
        ...ctx,
        questionnaireValidationErrors,
      };

      queriedQuestionnaire = await queryQuestionnaire(ctx);

      expect(queriedQuestionnaire.validationErrorInfo).toMatchObject({
        errors: questionnaireValidationErrors.errors,
        totalCount: questionnaireValidationErrors.errors.length,
      });
    });
  });

  describe("list questionnaires", () => {
    it("should order the newest to oldest", async () => {
      const user = {
        id: "123",
      };
      const { questionnaire: oldestQuestionnaire } = await buildContext(
        {},
        user
      );
      const { questionnaire: newestQuestionnaire } = await buildContext(
        {},
        user
      );
      const questionnaires = await listQuestionnaires(user);
      const oldestIndex = findIndex(
        questionnaires,
        (q) => q.id === oldestQuestionnaire.id
      );
      const newestIndex = findIndex(
        questionnaires,
        (q) => q.id === newestQuestionnaire.id
      );
      expect(oldestIndex > newestIndex).toEqual(true);
    });
    it("should not list unaccessible private questionnaires", async () => {
      const user = {
        id: "123",
      };

      const { questionnaire: publicQuestionnaire } = await buildContext(
        {},
        user
      );
      const { questionnaire: privateQuestionnaire } = await buildContext({
        isPublic: false,
      });
      const questionnaires = await listQuestionnaires(user);

      expect(
        find(questionnaires, (q) => q.id === publicQuestionnaire.id)
      ).toBeTruthy();
      expect(
        find(questionnaires, (q) => q.id === privateQuestionnaire.id)
      ).toBeFalsy();
    });
  });

  describe("delete", () => {
    it("should delete a questionnaire", async () => {
      ctx = await buildContext({});
      await deleteQuestionnaire(ctx, ctx.questionnaire.id);
      const deletedQuestionnaire = await queryQuestionnaire(ctx);
      expect(deletedQuestionnaire).toBeNull();
      questionnaire = null;
    });
  });

  describe("versioning", () => {
    let questionnaireConfig;
    beforeEach(async () => {
      ctx = buildContext();
      ctx = { user: defaultUser() };
      createUser(ctx.user);

      questionnaireConfig = {
        title: "Which Game of Thrones house are you?",
        description: "Description",
        surveyId: "1",
        theme: "default",
        navigation: false,
        summary: false,
        type: SOCIAL,
        shortTitle: "short title",
      };

      await createQuestionnaire(ctx, questionnaireConfig);

      await createAnswer(ctx, {
        questionPageId: ctx.questionnaire.sections[0].folders[0].pages[0].id,
        type: NUMBER,
      });
    });

    it("should initialise new questionnaires at version 1", () => {
      expect(ctx.questionnaire.surveyVersion).toEqual("1");
    });

    it("should increment the version number by 1 when a change is made", async () => {
      expect(ctx.questionnaire.surveyVersion).toEqual("1");

      ctx.questionnaire.publishStatus = "Published";

      const answer =
        ctx.questionnaire.sections[0].folders[0].pages[0].answers[0];
      const update = {
        id: answer.id,
        description: "answer-description-update",
        guidance: "answer-guidance-update",
        label: "answer-label-update",
        qCode: "answer-qcode-update",
        properties: {
          decimals: 0,
          required: true,
        },
      };

      await updateAnswer(ctx, update);
      expect(ctx.questionnaire.surveyVersion).toEqual("2");
    });
  });
});
