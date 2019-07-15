import { mapMutateToProps } from "./withDeleteQuestionConfirmation";

describe("withDeleteQuestionConfirmation", () => {
  let mutate, ownProps, questionnaireId, pageId, confirmationId;

  beforeEach(() => {
    questionnaireId = "1";
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
      match: {
        params: {
          questionnaireId,
          confirmationId,
          tab: "design",
        },
      },
      showToast: jest.fn(),
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
      page: {
        id: pageId,
      },
    });
    expect(ownProps.history.push).toHaveBeenCalledWith(
      `/q/${questionnaireId}/page/${pageId}/design`
    );
  });

  it("should show the toast passing the message", async () => {
    const questionConfirmation = {
      id: confirmationId,
      page: {
        id: pageId,
      },
    };
    await mapMutateToProps({
      mutate,
      ownProps,
    }).onDeleteQuestionConfirmation(questionConfirmation);
    expect(ownProps.showToast).toHaveBeenCalledWith("Confirmation deleted");
  });
});
