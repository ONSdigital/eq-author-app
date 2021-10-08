import { mapMutateToProps } from "./withDeleteAnswer";

describe("containers/QuestionnaireDesignPage/withDeleteAnswer", () => {
  let mutate, showToast, ownProps;
  let deletedAnswer, currentPage;

  beforeEach(() => {
    deletedAnswer = {
      id: "2",
    };

    currentPage = {
      id: "1",
    };

    showToast = jest.fn();

    ownProps = {
      showToast,
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
        expect(mutate).toHaveBeenCalledWith({
          variables: {
            input: { id: deletedAnswer.id },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });
    });


    it("should show a toast after onDeleteAnswer is invoked", async () => {
      await props.onDeleteAnswer(currentPage.id, deletedAnswer.id);
      expect(showToast).toHaveBeenCalledWith(expect.stringContaining("Answer"));
    });
  });
});
