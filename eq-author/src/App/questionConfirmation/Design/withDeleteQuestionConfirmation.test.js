import { mapMutateToProps } from "./withDeleteQuestionConfirmation";

describe("withDeleteQuestionConfirmation", () => {
  let mutate, ownProps;

  beforeEach(() => {
    mutate = jest.fn().mockResolvedValue({
      data: {
        deleteQuestionConfirmation: {
          id: "4"
        }
      }
    });
    ownProps = {
      history: {
        push: jest.fn()
      },
      location: {
        pathname: "/1/2/3/4/design"
      },
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3",
          confirmationId: "4",
          tab: "design"
        }
      },
      raiseToast: jest.fn()
    };
  });

  it("should return a function onDeleteQuestionConfirmation", () => {
    expect(
      mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation
    ).toEqual(expect.any(Function));
  });

  it("should filter the values and run the delete", async () => {
    const confirmationToDelete = {
      id: "4",
      page: {
        id: "5"
      },
      positive: {
        label: "yes",
        something: "wrong"
      }
    };
    await mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation(
      confirmationToDelete
    );

    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: "4"
        }
      }
    });
  });

  it("should navigate to the parent page", async () => {
    await mapMutateToProps({ mutate, ownProps }).onDeleteQuestionConfirmation({
      id: "4"
    });
    expect(ownProps.history.push).toHaveBeenCalledWith(
      "/questionnaire/1/2/3/design"
    );
  });

  it("should show the toast passing the confirmation to restore and message", async () => {
    const questionConfirmation = { id: "4" };
    await mapMutateToProps({
      mutate,
      ownProps
    }).onDeleteQuestionConfirmation(questionConfirmation);
    expect(ownProps.raiseToast).toHaveBeenCalledWith(
      "QuestionConfirmation4",
      "Confirmation deleted",
      "undeleteQuestionConfirmation",
      { questionConfirmation, goBack: expect.any(Function) }
    );
  });

  it("should navigate back to the original url when goBack is called", async () => {
    const questionConfirmation = { id: "4" };
    await mapMutateToProps({
      mutate,
      ownProps
    }).onDeleteQuestionConfirmation(questionConfirmation);
    ownProps.raiseToast.mock.calls[0][3].goBack();
    expect(ownProps.history.push).toHaveBeenCalledWith("/1/2/3/4/design");
  });
});
