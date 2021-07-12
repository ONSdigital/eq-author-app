import {
  buildQuestionnairePath,
  buildSectionPath,
  buildPagePath,
  buildConfirmationPath,
  buildIntroductionPath,
  buildDesignPath,
  buildPreviewPath,
  buildLogicPath,
  buildFolderPath,
} from "utils/UrlUtils";

const questionnaireId = "1";
const sectionId = "2";
const pageId = "3";
const confirmationId = "4";
const introductionId = "5";
const folderId = "6";

describe("buildQuestionnairePath", () => {
  it("builds a valid path", () => {
    const path = buildQuestionnairePath({ questionnaireId });
    expect(path).toEqual(`/q/${questionnaireId}`);
  });

  it("throws if questionnaireId not supplied", () => {
    expect(() => buildQuestionnairePath({})).toThrow();
  });
});

describe("buildSectionPath", () => {
  it("builds a valid path", () => {
    const path = buildSectionPath({ questionnaireId, sectionId });
    expect(path).toEqual(`/q/${questionnaireId}/section/${sectionId}/design`);
  });

  it("throws if any param not supplied", () => {
    expect(() => buildSectionPath({})).toThrow();
    expect(() => buildSectionPath({ questionnaireId })).toThrow();
    expect(() => buildSectionPath({ sectionId })).toThrow();
  });

  it("rejects invalid tabs", () => {
    const path = buildSectionPath({
      questionnaireId,
      sectionId,
      tab: "routing",
    });
    expect(path).toEqual(`/q/${questionnaireId}/section/${sectionId}/design`);
  });
});

describe("Build folder path", () => {
  it("Builds a valid path", () => {
    const path = buildFolderPath({ questionnaireId, folderId });
    expect(path).toEqual(`/q/${questionnaireId}/folder/${folderId}/design`);
  });

  it("Throws if any param is not supplied", () => {
    expect(() => buildFolderPath({})).toThrow();
    expect(() => buildFolderPath({ questionnaireId })).toThrow();
    expect(() => buildFolderPath({ folderId })).toThrow();
  });
});

describe("buildPagePath", () => {
  it("builds a valid path", () => {
    const path = buildPagePath({
      questionnaireId,
      pageId,
    });
    expect(path).toEqual(`/q/${questionnaireId}/page/${pageId}/design`);
  });

  it("throws if any param not supplied", () => {
    expect(() => buildPagePath({})).toThrow();
    expect(() => buildPagePath({ questionnaireId })).toThrow();
    expect(() => buildPagePath({ pageId })).toThrow();
  });

  it("rejects invalid tabs", () => {
    const path = buildPagePath({
      questionnaireId,
      pageId,
      tab: "foobar",
    });
    expect(path).toEqual(`/q/${questionnaireId}/page/${pageId}/design`);
  });
});

describe("buildConfirmationPath", () => {
  it("builds a valid path", () => {
    const path = buildConfirmationPath({
      questionnaireId,
      confirmationId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/question-confirmation/${confirmationId}/preview`
    );
  });

  it("throws if any param not supplied", () => {
    expect(() => buildConfirmationPath({})).toThrow();
    expect(() => buildConfirmationPath({ questionnaireId })).toThrow();
    expect(() => buildConfirmationPath({ confirmationId })).toThrow();
  });
});

describe("buildIntroductionPath", () => {
  it("builds a valid path", () => {
    const path = buildIntroductionPath({
      questionnaireId,
      introductionId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/introduction/${introductionId}/preview`
    );
  });

  it("throws if any param not supplied", () => {
    expect(() => buildIntroductionPath({})).toThrow();
    expect(() => buildIntroductionPath({ questionnaireId })).toThrow();
    expect(() => buildIntroductionPath({ introductionId })).toThrow();
  });

  it("rejects invalid tabs", () => {
    const path = buildIntroductionPath({
      questionnaireId,
      introductionId,
      tab: "routing",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/introduction/${introductionId}/design`
    );
  });
});

describe("buildDesignPath", () => {
  it("builds a page design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      pageId,
      tab: "routing",
    });
    expect(path).toEqual(`/q/${questionnaireId}/page/${pageId}/design`);
  });

  it("builds a section design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      sectionId,
      tab: "preview",
    });
    expect(path).toEqual(`/q/${questionnaireId}/section/${sectionId}/design`);
  });

  it("builds a confirmation design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      confirmationId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/question-confirmation/${confirmationId}/design`
    );
  });

  it("builds an introduction design path", () => {
    const path = buildDesignPath({
      questionnaireId,
      introductionId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/introduction/${introductionId}/design`
    );
  });
});

describe("buildPreviewPath", () => {
  it("builds a page Preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      pageId,
      tab: "routing",
    });
    expect(path).toEqual(`/q/${questionnaireId}/page/${pageId}/preview`);
  });

  it("builds a section Preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      sectionId,
      tab: "preview",
    });
    expect(path).toEqual(`/q/${questionnaireId}/section/${sectionId}/preview`);
  });

  it("builds a confirmation Preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      confirmationId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/question-confirmation/${confirmationId}/preview`
    );
  });

  it("builds an introduction Preview path", () => {
    const path = buildPreviewPath({
      questionnaireId,
      introductionId,
      tab: "preview",
    });
    expect(path).toEqual(
      `/q/${questionnaireId}/introduction/${introductionId}/preview`
    );
  });
});

describe("buildLogicPath", () => {
  it("builds a page Routing path", () => {
    const path = buildLogicPath({
      questionnaireId,
      pageId,
      tab: "design",
    });
    expect(path).toEqual(`/q/${questionnaireId}/page/${pageId}/logic`);
  });

  it("builds a confirmation Routing path", () => {
    const path = buildLogicPath({
      questionnaireId,
      confirmationId,
      tab: "design",
    });

    expect(path).toEqual(
      `/q/${questionnaireId}/question-confirmation/${confirmationId}/logic`
    );
  });
});
