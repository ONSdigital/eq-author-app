import {
  buildQuestionnairePath,
  buildSectionPath,
  buildPagePath,
  buildDesignPath,
  buildPreviewPath,
  buildRoutingPath,
  isOnPage,
  isOnConfirmation,
  isOnSection,
} from "utils/UrlUtils";

import fakeId from "tests/utils/fakeId";

const questionnaireId = fakeId("1");
const sectionId = fakeId("2");
const pageId = fakeId("3");
const confirmationId = fakeId("4");

describe("buildQuestionnairePath", () => {
  it("builds a valid path", () => {
    const path = buildQuestionnairePath({ questionnaireId });
    expect(path).toEqual(`/questionnaire/${questionnaireId}`);
  });

  it("throws if questionnaireId not supplied", () => {
    expect(() => buildQuestionnairePath({})).toThrow();
  });
});

describe("buildSectionPath", () => {
  it("builds a valid path", () => {
    const path = buildSectionPath({ questionnaireId, sectionId });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/design`
    );
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
      pageId,
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/design`
    );
  });

  it("throws if any param not supplied", () => {
    expect(() => buildPagePath({})).toThrow();
    expect(() => buildPagePath({ questionnaireId })).toThrow();
    expect(() => buildPagePath({ questionnaireId, sectionId })).toThrow();
    expect(() => buildPagePath({ questionnaireId, pageId })).toThrow();
    expect(() => buildPagePath({ sectionId, pageId })).toThrow();
  });
});

describe("buildDesignPath", () => {
  it("builds a page design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      sectionId,
      pageId,
      tab: "routing",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/design`
    );
  });

  it("builds a confirmation design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      sectionId,
      pageId,
      confirmationId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/${confirmationId}/design`
    );
  });
});

describe("buildPreviewPath", () => {
  it("builds a section preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      sectionId,
      tab: "design",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/preview`
    );
  });

  it("builds a page preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      sectionId,
      pageId,
      tab: "routing",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/preview`
    );
  });

  it("builds a page confirmation preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      sectionId,
      pageId,
      confirmationId,
      tab: "routing",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/${confirmationId}/preview`
    );
  });
});

describe("buildRoutingPath", () => {
  it("builds a page Routing path", () => {
    const path = buildRoutingPath({
      questionnaireId,
      sectionId,
      pageId,
      tab: "design",
    });
    expect(path).toEqual(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/routing`
    );
  });
});

describe("isOnPage", () => {
  let match;
  beforeEach(() => {
    match = {};
  });

  it("should be true when on a page", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      tab: "design",
    };
    expect(isOnPage(match)).toBeTruthy();
  });

  it("should be false when on a question confirmation", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      confirmationId: "1",
      tab: "design",
    };
    expect(isOnPage(match)).toBeFalsy();
  });

  it("should be false when on a section", () => {
    match.params = {
      questionnaireId,
      sectionId,
      tab: "design",
    };
    expect(isOnPage(match)).toBeFalsy();
  });
});

describe("isOnConfirmation", () => {
  let match;
  beforeEach(() => {
    match = {};
  });

  it("should be true when on a confirmation", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      confirmationId,
      tab: "design",
    };
    expect(isOnConfirmation(match)).toBeTruthy();
  });

  it("should be false when on a page", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      tab: "design",
    };
    expect(isOnConfirmation(match)).toBeFalsy();
  });

  it("should be false when on a section", () => {
    match.params = {
      questionnaireId,
      sectionId,
      tab: "design",
    };
    expect(isOnConfirmation(match)).toBeFalsy();
  });
});

describe("isOnSection", () => {
  let match;
  beforeEach(() => {
    match = {};
  });

  it("should be true when on a section", () => {
    match.params = {
      questionnaireId,
      sectionId,
    };
    expect(isOnSection(match)).toBeTruthy();
  });

  it("should be false when on a page", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      tab: "design",
    };
    expect(isOnSection(match)).toBeFalsy();
  });

  it("should be false when on a confirmation", () => {
    match.params = {
      questionnaireId,
      sectionId,
      pageId,
      confirmationId,
      tab: "design",
    };
    expect(isOnSection(match)).toBeFalsy();
  });
});
