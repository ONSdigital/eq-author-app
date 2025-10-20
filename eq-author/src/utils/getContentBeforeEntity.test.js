import {
  buildQuestionnaire,
  buildListCollectorFolders,
} from "tests/utils/createMockQuestionnaire";
import getPreviousContent from "./getContentBeforeEntity";

import { MUTUALLY_EXCLUSIVE, NUMBER } from "constants/answer-types";

let questionnaire = buildQuestionnaire({
  sectionCount: 2,
  folderCount: 2,
  pageCount: 2,
  answerCount: 2,
});
questionnaire.introduction = {
  id: "intro",
};

describe("utils/getPreviousAnswers", () => {
  beforeEach(() => {
    // Adds page ID to each answer
    questionnaire.sections.forEach((section) => {
      section.folders.forEach((folder) => {
        folder.pages.forEach((page) => {
          page.answers.forEach((answer) => {
            answer.page = {
              id: page.id,
            };
          });
        });
      });
    });
  });

  it("should return empty array when questionnaire or ID not provided", () => {
    expect(getPreviousContent()).toHaveLength(0);
  });

  it("should return mutually exclusive answers when expression's left side answer is on a different page", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type =
      MUTUALLY_EXCLUSIVE;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[0].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[0].id,
              },
            },
          },
        ],
      },
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has two pages
    expect(previousContent[1].folders[0].pages).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );

    // Tests previousContent[1]'s first folder's second page has two answers
    expect(previousContent[1].folders[0].pages[1].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's second page matches the questionnaire's second section's first folder's second page
    expect(previousContent[1].folders[0].pages[1]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[1]
    );
  });

  it("should not return mutually exclusive answers on the same page as the expression's left side answer", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type =
      MUTUALLY_EXCLUSIVE;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
        ],
      },
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has two pages
    expect(previousContent[1].folders[0].pages).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );

    // Tests to assert that the mutually exclusive answer is removed from previousContent[1]'s first folder's second page
    expect(previousContent[1].folders[0].pages[1].answers).toHaveLength(1);
    expect(previousContent[1].folders[0].pages[1].answers[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[1].answers[0]
    );
    expect(
      previousContent[1].folders[0].pages[1].answers.some(
        (answer) => answer.type === MUTUALLY_EXCLUSIVE
      )
    ).toBe(false);
  });

  it("should not return answers on the same page as expression's left side answer when left side answer is mutually exclusive", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type =
      MUTUALLY_EXCLUSIVE;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[1].id,
              type: MUTUALLY_EXCLUSIVE,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
        ],
      },
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has one page (the second page has been removed as left side answer is mutually exclusive)
    expect(previousContent[1].folders[0].pages).toHaveLength(1);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );
  });

  it("should allow selection of answers on the same page as the selected answer when it is the only expression using the selected answer's page", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type =
      MUTUALLY_EXCLUSIVE;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[0].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[0].id,
              },
            },
          },
        ],
      },
      selectedId: questionnaire.sections[1].folders[0].pages[1].answers[0].id,
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has two pages
    expect(previousContent[1].folders[0].pages).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );

    // Tests previousContent[1]'s first folder's second page has two answers
    expect(previousContent[1].folders[0].pages[1].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's second page matches the questionnaire's second section's first folder's second page
    expect(previousContent[1].folders[0].pages[1]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[1]
    );
  });

  it("should not allow selection of answers on the same page as the selected answer when other expressions in expression group use the selected answer's page and selected answer's page includes a mutually exclusive answer", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type =
      MUTUALLY_EXCLUSIVE;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[1].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
        ],
      },
      selectedId: questionnaire.sections[1].folders[0].pages[1].answers[1].id,
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has one page (the second page has been removed as another expression is using an answer from the same page)
    expect(previousContent[1].folders[0].pages).toHaveLength(1);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );
  });

  it("should allow selection of answers on the same page as the selected answer when other expressions in expression group use the selected answer's page and selected answer's page does not include a mutually exclusive answer", () => {
    questionnaire.sections[1].folders[0].pages[1].answers[1].type = NUMBER;

    const previousContent = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[1].id,
      includeTargetPage: true,
      expressionGroup: {
        operator: "And",
        expressions: [
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[0].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
          {
            left: {
              answerId:
                questionnaire.sections[1].folders[0].pages[1].answers[1].id,
              page: {
                id: questionnaire.sections[1].folders[0].pages[1].id,
              },
            },
          },
        ],
      },
      selectedId: questionnaire.sections[1].folders[0].pages[1].answers[1].id,
    });

    expect(previousContent).toHaveLength(2);

    // Tests previousContent[0] matches the questionnaire's first section
    expect(previousContent[0]).toMatchObject(questionnaire.sections[0]);

    // Tests previousContent[1]'s first folder has two pages
    expect(previousContent[1].folders[0].pages).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page has two answers
    expect(previousContent[1].folders[0].pages[0].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's first page matches the questionnaire's second section's first folder's first page
    expect(previousContent[1].folders[0].pages[0]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[0]
    );

    // Tests previousContent[1]'s first folder's second page has two answers
    expect(previousContent[1].folders[0].pages[1].answers).toHaveLength(2);
    // Tests previousContent[1]'s first folder's second page matches the questionnaire's second section's first folder's second page
    expect(previousContent[1].folders[0].pages[1]).toMatchObject(
      questionnaire.sections[1].folders[0].pages[1]
    );
  });

  it("should return empty array on questionnaire introduction page", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.introduction.id,
    });

    expect(previousSections).toHaveLength(0);
  });

  it("should return empty array when no pages preceed the target page", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[0].folders[0].pages[0].id,
    });

    expect(previousSections).toHaveLength(0);
  });

  it("should return questionnaire tree up to but not including target page", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[1].pages[0].id,
    });

    expect(previousSections).toHaveLength(2);
  });

  it("should return questionnaire tree up to but not including target section", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].id,
    });

    expect(previousSections).toHaveLength(1);
  });

  it("should return questionnaire tree up to but not including target folder", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[1].id,
    });

    expect(previousSections).toHaveLength(2);
    expect(previousSections[1].folders).toHaveLength(1);
  });

  it("should return questionnaire tree up to and including target page when includeTargetPage truthy", () => {
    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[1].pages[1].id,
      includeTargetPage: true,
    });

    expect(previousSections).toHaveLength(2);
    expect(previousSections[1].folders[1].pages).toHaveLength(2);
  });

  it("should not return answers from list collector page types", () => {
    questionnaire.sections[0].folders = [
      buildListCollectorFolders({
        listCollectorFolderCount: 1,
      })[0],
    ];

    const previousSections = getPreviousContent({
      questionnaire,
      id: questionnaire.sections[1].folders[0].pages[0].id,
    });

    expect(previousSections).toHaveLength(0);
  });
});
