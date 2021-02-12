import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import getPreviousContent from "./getPreviousAnswers";

const questionnaire = buildQuestionnaire({
  sectionCount: 2,
  folderCount: 2,
  pageCount: 2,
});

describe("utils/getPreviousAnswers", () => {
  it("should return empty array when no pages preceed the target page", () => {
    const previousContent = getPreviousContent({
      questionnaire,
      pageId: questionnaire.sections[0].folders[0].pages[0].id,
    });

    expect(previousContent.length).toBe(0);
  });

  it("should return questionnaire tree up to but not including target page", () => {
    const previousContent = getPreviousContent({
      questionnaire,
      pageId: questionnaire.sections[1].folders[1].pages[0].id,
    });

    console.log(previousContent);
    expect(previousContent.length).toBe(2);
  });
});
