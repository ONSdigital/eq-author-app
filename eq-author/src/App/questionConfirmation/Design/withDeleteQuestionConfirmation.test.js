import { mapMutateToProps } from "./withDeleteQuestionConfirmation";

describe("withDeleteQuestionConfirmation", () => {
  let mutate, ownProps, questionnaireId, sectionId, pageId, confirmationId;

  beforeEach(() => {
    questionnaireId = "1";
    sectionId = "2";
    pageId = "3";
    confirmationId = "4";

    mutate = jest.fn().mockResolvedValue({
      data: {
        deleteQuestionConfirmation: {
          id: confirmationId,
        },
      },
    });
    ownProps = {
      history: {
        push: jest.fn(),
      },
      location: {
        pathname: `/${questionnaireId}/${sectionId}/${pageId}/${confirmationId}/design`,
      },
      match: {
        params: {
          questionnaireId,
          sectionId,
          pageId,
          confirmationId,
          tab: "design",
        },
      },
      raiseToast: jest.fn(),
    };
  });

  it("should return a function onDeleteQuestionConfirmation", () => {
    expect(
      mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation
    ).toEqual(expect.any(Function));
  });

  it("should filter the values and run the delete", async () => {
    const confirmationToDelete = {
      id: confirmationId,
      page: {
        id: pageId,
      },
      positive: {
        label: "yes",
        something: "wrong",
      },
    };
    await mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation(
      confirmationToDelete
    );

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: confirmationId,
        },
      },
    });
  });

  it("should navigate to the parent page", async () => {
    await mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation({
      id: confirmationId,
    });
    expect(ownProps.history.push).toHaveBeenCalledWith(
      `/questionnaire/${questionnaireId}/${sectionId}/${pageId}/design`
    );
  });

  it("should show the toast passing the confirmation to restore and message", async () => {
    const questionConfirmation = { id: confirmationId };
    await mapMutateToProps({
      mutate,
      ownProps,
    }).onDeleteQuestionConfirmation(questionConfirmation);
    expect(ownProps.raiseToast).toHaveBeenCalledWith(
      `QuestionConfirmation${confirmationId}`,
      "Confirmation deleted",
      { questionConfirmation, goBack: expect.any(Function) }
    );
  });

  it("should navigate back to the original url when goBack is called", async () => {
    const questionConfirmation = { id: confirmationId };
    await mapMutateToProps({
      mutate,
      ownProps,
    }).onDeleteQuestionConfirmation(questionConfirmation);
    ownProps.raiseToast.mock.calls[0][2].goBack();
    expect(ownProps.history.push).toHaveBeenCalledWith(
      `/${questionnaireId}/${sectionId}/${pageId}/${confirmationId}/design`
    );
  });
});
