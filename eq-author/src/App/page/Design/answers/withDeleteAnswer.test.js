import { mapMutateToProps } from "./withDeleteAnswer";

describe("containers/QuestionnaireDesignPage/withDeleteAnswer", () => {
  let mutate, raiseToast, ownProps;
  let deletedAnswer, currentPage;

  beforeEach(() => {
    deletedAnswer = {
      id: "2",
    };

    currentPage = {
      id: "1",
    };

    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      raiseToast,
    };

    mutate = jest.fn(() => Promise.resolve());
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should have a onDeleteAnswer prop", () => {
      expect(props.onDeleteAnswer).toBeInstanceOf(Function);
    });

    it("should call mutate when onDeleteAnswer is invoked", () => {
      return props.onDeleteAnswer(currentPage.id, deletedAnswer.id).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: { id: deletedAnswer.id },
            },
          })
        );
      });
    });

    it("should raise a toast after onDeleteAnswer is invoked", () => {
      return props.onDeleteAnswer(currentPage.id, deletedAnswer.id).then(() => {
        expect(raiseToast).toHaveBeenCalledWith(
          `Answer${deletedAnswer.id}`,
          expect.stringContaining("Answer"),
          expect.objectContaining({
            pageId: currentPage.id,
            answerId: deletedAnswer.id,
          })
        );
      });
    });
  });
});
