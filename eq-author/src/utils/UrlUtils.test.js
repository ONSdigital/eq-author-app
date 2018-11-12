import {
  buildQuestionnairePath,
  buildSectionPath,
  buildPagePath
} from "utils/UrlUtils";

const questionnaireId = "1";
const sectionId = "2";
const pageId = "3";

describe("buildQuestionnairePath", () => {
  it("builds a valid path", () => {
    const path = buildQuestionnairePath({ questionnaireId });
    expect(path).toEqual("/questionnaire/1");
  });

  it("throws if questionnaireId not supplied", () => {
    expect(() => buildQuestionnairePath({})).toThrow();
  });
});

describe("buildSectionPath", () => {
  it("builds a valid path", () => {
    const path = buildSectionPath({ questionnaireId, sectionId });
    expect(path).toEqual("/questionnaire/1/2/design");
  });

  it("throws if any param not supplied", () => {
    expect(() => buildSectionPath({})).toThrow();
    expect(() => buildSectionPath({ questionnaireId })).toThrow();
    expect(() => buildSectionPath({ sectionId })).toThrow();
  });
});

describe("buildPagePath", () => {
  it("builds a valid path", () => {
    const path = buildPagePath({
      questionnaireId,
      sectionId,
      pageId
    });
    expect(path).toEqual("/questionnaire/1/2/3/design");
  });

  it("throws if any param not supplied", () => {
    expect(() => buildPagePath({})).toThrow();
    expect(() => buildPagePath({ questionnaireId })).toThrow();
    expect(() => buildPagePath({ questionnaireId, sectionId })).toThrow();
    expect(() => buildPagePath({ questionnaireId, pageId })).toThrow();
    expect(() => buildPagePath({ sectionId, pageId })).toThrow();
  });
});
