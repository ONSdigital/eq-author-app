import { mapMutateToProps } from "./withCreateQuestionConfirmation";

describe("withCreateQuestionConfirmation", () => {
  let mutate, ownProps;

  beforeEach(() => {
    mutate = jest.fn().mockResolvedValue({
      data: {
        createQuestionConfirmation: {
          id: "4",
          page: {
            id: "3"
          }
        }
      }
    });

    ownProps = {
      history: {
        push: jest.fn()
      },
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2"
        }
      }
    };
  });

  it("should return an onCreateQuestioonConfirmation function", () => {
    expect(mapMutateToProps({}).onCreateQuestionConfirmation).toEqual(
      expect.any(Function)
    );
  });

  it("should run the create mutation passing the pageId", async () => {
    const pageId = "3";
    await mapMutateToProps({ mutate, ownProps }).onCreateQuestionConfirmation(
      pageId
    );
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: { pageId } }
    });
  });

  it("should run the redirect to the new page on success", async () => {
    await mapMutateToProps({ mutate, ownProps }).onCreateQuestionConfirmation(
      "3"
    );
    expect(ownProps.history.push).toHaveBeenCalledWith(
      "/questionnaire/1/2/3/4/design"
    );
  });
});
