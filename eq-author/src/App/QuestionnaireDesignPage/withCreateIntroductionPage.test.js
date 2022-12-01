import { mapMutateToProps } from "./withCreateIntroductionPage";

describe("withCreateIntroductionPage", () => {
  let mutate, ownProps, questionnaireId, introductionId;

  beforeEach(() => {
    questionnaireId = "questionnaire-1";
    introductionId = "introduction-1";

    mutate = jest.fn().mockResolvedValue({
      data: {
        createIntroductionPage: {
          id: introductionId,
        },
      },
    });

    ownProps = {
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          questionnaireId,
        },
      },
    };
  });

  it("should return an onAddIntroductionPage function", () => {
    expect(mapMutateToProps({}).onAddIntroductionPage).toEqual(
      expect.any(Function)
    );
  });

  it("should run the create mutation", async () => {
    await mapMutateToProps({ mutate, ownProps }).onAddIntroductionPage();
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it("should run the redirect to the new page on success", async () => {
    await mapMutateToProps({ mutate, ownProps }).onAddIntroductionPage();
    expect(ownProps.history.push).toHaveBeenCalledWith(
      `/q/${questionnaireId}/introduction/${introductionId}/design`
    );
  });
});
