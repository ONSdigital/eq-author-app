import { resolvers } from ".";

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

  beforeEach(() => {
    cacheData = {
      newPagesList: [1],
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

    const newPages = [3, 4];

    resolvers.Mutation.createQuestionnaire(questionnaire, {}, { cache });

    expect(cacheData.newPagesList).toMatchObject(newPages);
  });

  it("should initialise new pages on create page and remove on update", () => {
    const questionnaire = {
      createQuestionPage: { id: 5 },
    };

    const newPages = [1, 5];

    resolvers.Mutation.createQuestionPage(questionnaire, {}, { cache });

    expect(cacheData.newPagesList).toMatchObject(newPages);

    const updateQuestionnaire = {
      updateQuestionPage: { id: 5 },
    };

    const newUpdatePages = [1];

    resolvers.Mutation.updateQuestionPage(updateQuestionnaire, {}, { cache });

    expect(cacheData.newPagesList).toMatchObject(newUpdatePages);
  });

  it("should initalise pages when creating a new section", () => {
    const section = {
      createSection: {
        pages: [{ id: 7 }],
      },
    };

    expect(cacheData.newPagesList).toMatchObject([1]);

    resolvers.Mutation.createSection(section, {}, { cache });

    expect(cacheData.newPagesList).toMatchObject([1, 7]);
  });
});
