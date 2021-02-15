import { mapMutateToProps } from "./withUpdateQuestionnaireIntroduction";

describe("withUpdateQuestionnaireIntroduction", () => {
  let mutate;
  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should return a updateQuestionnaireIntroduction func", () => {
    expect(
      mapMutateToProps({ mutate }).updateQuestionnaireIntroduction
    ).toBeInstanceOf(Function);
  });

  it("should filter the args to what is allowed and call mutate", () => {
    mapMutateToProps({ mutate }).updateQuestionnaireIntroduction({
      introductionId: "introId",
      title: "title",
      description: "description",
      additionalGuidancePanel: "Guidance Panel",
      additionalGuidancePanelSwitch: true,
      foo: "foo",
    });

    expect(mutate).toHaveBeenCalledWith({
      optimisticResponse: {
        updateQuestionnaireIntroduction: {
          introductionId: "introId",
          title: "title",
          description: "description",
          additionalGuidancePanel: "Guidance Panel",
          additionalGuidancePanelSwitch: true,
          foo: "foo",
          __typename: "QuestionnaireIntroduction",
        },
      },
      variables: {
        input: {
          title: "title",
          description: "description",
          additionalGuidancePanel: "Guidance Panel",
          additionalGuidancePanelSwitch: true,
        },
      },
    });
  });
});
