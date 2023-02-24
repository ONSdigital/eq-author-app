import getCalculatedSummaryPages from "./getCalculatedSummaryPages";
import mockCalculatedSummary from "tests/mocks/mockCalculatedSummary.json";

const questionnaire = mockCalculatedSummary;

describe("utils/getCalculatedSummaryPages", () => {
  it("should return empty array when no pages preceed the target page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[0].id
    );
    expect(previousSections).toHaveLength(0);
  });

  it("should return empty when the target page is the first calculated summary page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[0].id
    );
    expect(previousSections).toHaveLength(0);
  });

  it("should return the two calculated summary pages when the target is the calculated summary page in the second section", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[1].id
    );
    expect(previousSections).toHaveLength(1);
    expect(previousSections[0].folders[0].pages).toHaveLength(2);
  });

  it("Should return all the calculated summary answers which preceed the target page", () => {
    const previousSections = getCalculatedSummaryPages(
      questionnaire,
      questionnaire.sections[2].id
    );
    expect(previousSections).toHaveLength(2);
    expect(previousSections[0].folders).toHaveLength(1);
    expect(previousSections[0].folders[0].pages).toHaveLength(2);
  });
});
