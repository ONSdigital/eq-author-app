import { resolvers } from ".";
import { PAGES, ANSWERS } from "../../constants/validation-error-types";

describe("resolvers", () => {
  let cacheData;

  const readQuery = () => {
    return cacheData;
  };

  const writeData = ({ data }) => {
    cacheData = data;
  };

  const cache = {
    readQuery,
    writeData,
  };

  describe("pages", () => {
    beforeEach(() => {
      cacheData = {
        newEntityList: [`${PAGES}_1`],
      };
    });

    it("should return whether a page has been newly created in this session and is visited for first time", () => {
      const isNew1 = resolvers.QuestionPage.isNew({ id: 1 }, {}, { cache });
      expect(isNew1).toEqual(true);

      const isNew2 = resolvers.QuestionPage.isNew({ id: 2 }, {}, { cache });
      expect(isNew2).toEqual(false);
    });

    it("should initialise all pages on create questionnaire", () => {
      const questionnaire = {
        createQuestionnaire: {
          sections: [
            {
              pages: [{ id: 3 }, { id: 4 }],
            },
          ],
        },
      };

      const newPages = [`${PAGES}_3`, `${PAGES}_4`];

      resolvers.Mutation.createQuestionnaire(questionnaire, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject(newPages);
    });

    it("should initialise new pages on create page and remove on update", () => {
      const questionnaire = {
        createQuestionPage: { id: 5 },
      };

      const newPages = [`${PAGES}_1`, `${PAGES}_5`];

      resolvers.Mutation.createQuestionPage(questionnaire, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject(newPages);

      const updateQuestionnaire = {
        updateQuestionPage: { id: 5 },
      };

      const newUpdatePages = [`${PAGES}_1`];

      resolvers.Mutation.updateQuestionPage(updateQuestionnaire, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject(newUpdatePages);
    });

    it("should initialise pages when creating a new section", () => {
      const section = {
        createSection: {
          pages: [{ id: 7 }],
        },
      };

      expect(cacheData.newEntityList).toMatchObject([`${PAGES}_1`]);

      resolvers.Mutation.createSection(section, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject([
        `${PAGES}_1`,
        `${PAGES}_7`,
      ]);
    });
  });

  describe("Basic answer", () => {
    beforeEach(() => {
      cacheData = {
        newEntityList: [`${ANSWERS}_1`],
      };
    });

    it("should return whether a basic answer  has been newly created in this session and is visited for first time", () => {
      const isNew1 = resolvers.BasicAnswer.isNew({ id: 1 }, {}, { cache });
      expect(isNew1).toEqual(true);

      const isNew2 = resolvers.BasicAnswer.isNew({ id: 2 }, {}, { cache });
      expect(isNew2).toEqual(false);
    });

    it("should initialise new basic answer and remove on update", () => {
      const answer = {
        createAnswer: { id: 2 },
      };

      const newPages = [`${ANSWERS}_1`, `${ANSWERS}_2`];

      resolvers.Mutation.createAnswer(answer, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject(newPages);

      const updateAnswer = {
        updateAnswer: { id: 2 },
      };

      const newUpdatePages = [`${ANSWERS}_1`];

      resolvers.Mutation.updateAnswer(updateAnswer, {}, { cache });

      expect(cacheData.newEntityList).toMatchObject(newUpdatePages);
    });
  });
});
