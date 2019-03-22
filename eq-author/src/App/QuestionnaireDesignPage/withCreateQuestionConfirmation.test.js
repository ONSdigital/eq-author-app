import { mapMutateToProps } from "./withCreateQuestionConfirmation";

describe("withCreateQuestionConfirmation", () => {
  let mutate, ownProps, questionnaireId, sectionId, pageId, confirmationId;

  beforeEach(() => {
    questionnaireId = "1";
    sectionId = "2";
    pageId = "3";
    confirmationId = "4";

    mutate = jest.fn().mockResolvedValue({
      data: {
        createQuestionConfirmation: {
          id: confirmationId,
          page: {
            id: pageId,
          },
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
          sectionId,
        },
      },
    };
  });

  it("should return an onCreateQuestioonConfirmation function", () => {
    expect(mapMutateToProps({}).onCreateQuestionConfirmation).toEqual(
      expect.any(Function)
    );
  });

  it("should run the create mutation passing the pageId", async () => {
    await mapMutateToProps({ mutate, ownProps }).onCreateQuestionConfirmation(
      pageId
    );
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: { pageId } },
    });
  });

  it("should run the redirect to the new page on success", async () => {
    await mapMutateToProps({ mutate, ownProps }).onCreateQuestionConfirmation(
      "3"
    );
    expect(ownProps.history.push).toHaveBeenCalledWith(
      `/q/${questionnaireId}/question-confirmation/${confirmationId}/design`
    );
  });
});
