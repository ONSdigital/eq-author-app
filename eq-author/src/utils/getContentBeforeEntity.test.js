import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import getPreviousContent from "./getContentBeforeEntity";

const questionnaire = buildQuestionnaire({
  sectionCount: 2,
  folderCount: 2,
  pageCount: 2,
  answerCount: 2,
});
questionnaire.introduction = {
  id: "intro",
};

describe("utils/getPreviousAnswers", () => {
  it("should return empty array when questionnaire or ID not provided", () => {
    expect(getPreviousContent()).toHaveLength(0);
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
});
