const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");
const { queryPage } = require("../../tests/utils/questionnaireBuilder/page");
const {
  createAnswer,
  deleteAnswer,
} = require("../../tests/utils/questionnaireBuilder/answer");
const {
  toggleValidation,
  updateValidation,
} = require("../../tests/utils/questionnaireBuilder/validation");

const { NUMBER, CURRENCY, PERCENTAGE } = require("../../constants/answerTypes");
const {
  CUSTOM,
  PREVIOUS_ANSWER,
} = require("../../constants/validationEntityTypes");
const {
  EQUAL,
  LESS_THAN_EQUAL,
} = require("../../constants/validationConditions");

describe("Answer group validation", () => {
  describe("creation", () => {
    it("should create a answer group validation for the second numeric answer", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });

      const pageId = questionnaire.sections[0].pages[0].id;
      const page = await queryPage(questionnaire, pageId);

      expect(page.totalValidation).toBeNull();

      await createAnswer(questionnaire, {
        questionPageId: pageId,
        type: NUMBER,
      });

      const updatePage = await queryPage(questionnaire, pageId);
      expect(updatePage.totalValidation).toEqual({
        id: expect.any(String),
        entityType: CUSTOM,
        condition: EQUAL,
        enabled: false,
        custom: null,
        previousAnswer: null,
        availablePreviousAnswers: [],
      });
    });

    it("should remove the validation group when another answer type is added", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });

      const pageId = questionnaire.sections[0].pages[0].id;
      const page = await queryPage(questionnaire, pageId);

      expect(page.totalValidation).not.toBeNull();

      await createAnswer(questionnaire, {
        questionPageId: pageId,
        type: CURRENCY,
      });

      const updatedPage = await queryPage(questionnaire, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });

    it("should not add it even when a second is added", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                  {
                    type: NUMBER,
                  },
                  {
                    type: CURRENCY,
                  },
                ],
              },
            ],
          },
        ],
      });

      const pageId = questionnaire.sections[0].pages[0].id;
      const page = await queryPage(questionnaire, pageId);

      expect(page.totalValidation).toBeNull();

      await createAnswer(questionnaire, {
        questionPageId: pageId,
        type: CURRENCY,
      });

      const updatedPage = await queryPage(questionnaire, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });
  });

  describe("deletion", () => {
    it("should remove the validation when the second answer is removed", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: CURRENCY,
                  },
                  {
                    type: CURRENCY,
                  },
                ],
              },
            ],
          },
        ],
      });

      const pageId = questionnaire.sections[0].pages[0].id;
      const page = await queryPage(questionnaire, pageId);

      expect(page.totalValidation).not.toBeNull();

      await deleteAnswer(questionnaire, page.answers[0].id);

      const updatedPage = await queryPage(questionnaire, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });

    it("should add the validation when the last blocking type is removed", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: CURRENCY,
                  },
                  {
                    type: CURRENCY,
                  },
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });

      const pageId = questionnaire.sections[0].pages[0].id;
      const page = await queryPage(questionnaire, pageId);

      expect(page.totalValidation).toBeNull();

      await deleteAnswer(questionnaire, page.answers[2].id);

      const updatedPage = await queryPage(questionnaire, pageId);
      expect(updatedPage.totalValidation).not.toBeNull();
    });
  });

  describe("mutation", () => {
    it("can be toggled on", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: PERCENTAGE,
                  },
                  {
                    type: PERCENTAGE,
                  },
                ],
              },
            ],
          },
        ],
      });

      const page = questionnaire.sections[0].pages[0];
      const totalValidation = page.totalValidation;

      expect(totalValidation.enabled).toBe(false);

      await toggleValidation(questionnaire, {
        id: totalValidation.id,
        enabled: true,
      });

      const updatedPage = await queryPage(questionnaire, page.id);

      expect(updatedPage.totalValidation.enabled).toBe(true);
    });

    it("can be changed to a custom value", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: NUMBER,
                  },
                  {
                    type: NUMBER,
                  },
                ],
              },
            ],
          },
        ],
      });

      const page = questionnaire.sections[0].pages[0];
      const totalValidation = page.totalValidation;

      expect(totalValidation).toMatchObject({
        custom: null,
        condition: EQUAL,
        entityType: CUSTOM,
      });

      await updateValidation(questionnaire, {
        id: totalValidation.id,
        totalInput: {
          custom: 5,
          condition: LESS_THAN_EQUAL,
          entityType: CUSTOM,
        },
      });

      const updatedPage = await queryPage(questionnaire, page.id);

      expect(updatedPage.totalValidation).toMatchObject({
        custom: 5,
        condition: LESS_THAN_EQUAL,
        entityType: CUSTOM,
      });
    });

    it("can be changed to a previous answer", async () => {
      const questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                answers: [{ type: PERCENTAGE }],
              },
              {
                answers: [
                  {
                    type: PERCENTAGE,
                  },
                  {
                    type: PERCENTAGE,
                  },
                ],
              },
            ],
          },
        ],
      });
      const page = questionnaire.sections[0].pages[1];
      const totalValidation = page.totalValidation;
      const previousAnswerId = questionnaire.sections[0].pages[0].answers[0].id;

      expect(totalValidation).toMatchObject({
        previousAnswer: null,
        condition: EQUAL,
        entityType: CUSTOM,
      });

      await updateValidation(questionnaire, {
        id: totalValidation.id,
        totalInput: {
          previousAnswer: previousAnswerId,
          condition: LESS_THAN_EQUAL,
          entityType: PREVIOUS_ANSWER,
        },
      });

      const updatedPage = await queryPage(questionnaire, page.id);

      expect(updatedPage.totalValidation).toMatchObject({
        custom: null,
        condition: LESS_THAN_EQUAL,
        entityType: PREVIOUS_ANSWER,
        previousAnswer: {
          id: previousAnswerId,
        },
        availablePreviousAnswers: [
          {
            id: previousAnswerId,
          },
        ],
      });
    });
  });
});
