const translateRoutingDestination = require("./translateRoutingDestination");
const questionnaireJson = require("./basicQuestionnaireJSON");

describe("Translation of a routing destination", () => {
  it("should translate an absolute destination to another Page", () => {
    const authorDestination = {
      page: {
        id: "2"
      }
    };
    expect(translateRoutingDestination(authorDestination)).toMatchObject({
      block: "block2"
    });
  });
  it("should translate an absolute destination to another Section", () => {
    const authorDestination = {
      section: {
        id: "2"
      }
    };
    expect(translateRoutingDestination(authorDestination)).toMatchObject({
      group: "group2"
    });
  });
  it("should translate a next page destination", () => {
    const authorDestination = {
      logical: "NextPage"
    };
    expect(
      translateRoutingDestination(authorDestination, "1", { questionnaireJson })
    ).toMatchObject({ block: "block2" });
  });

  it("should translate a next page destination when last page in section", () => {
    const authorDestination = {
      logical: "NextPage"
    };
    expect(
      translateRoutingDestination(authorDestination, "2", { questionnaireJson })
    ).toMatchObject({ group: "group2" });
  });

  it("should translate a next page destination when last page in questionnaire", () => {
    const authorDestination = {
      logical: "NextPage"
    };
    expect(
      translateRoutingDestination(authorDestination, "3", { questionnaireJson })
    ).toMatchObject({ group: "confirmation-group" });
  });

  it("should translate a end of questionnaire destination", () => {
    const authorDestination = {
      logical: "EndOfQuestionnaire"
    };
    expect(
      translateRoutingDestination(authorDestination, "1", { questionnaireJson })
    ).toMatchObject({ group: "confirmation-group" });
  });

  it("should fail if not provided any destinations", () => {
    const authorDestination = {};

    expect(() => translateRoutingDestination(authorDestination)).toThrow(
      "not a valid destination object"
    );
  });

  it("should fail if provided a non-valid logical type", () => {
    const authorDestination = { logical: "Foo" };

    expect(() => translateRoutingDestination(authorDestination)).toThrow(
      "not a valid destination type"
    );
  });
});
