import {
  mapMutateToProps,
  deleteUpdater
} from "containers/enhancers/withDeleteAnswer";
import fragment from "graphql/pageFragment.graphql";

describe("containers/QuestionnaireDesignPage/withDeleteAnswer", () => {
  let mutate, result, raiseToast, ownProps;
  let deletedAnswer, currentPage;

  beforeEach(() => {
    deletedAnswer = {
      id: "2",
      sectionId: "2"
    };

    currentPage = {
      id: "1",
      sectionId: "1",
      answers: [deletedAnswer]
    };

    result = {
      data: {
        deleteAnswer: deletedAnswer
      }
    };

    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      raiseToast
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("deleteUpdater", () => {
    it("should remove the answer from the cache", () => {
      const id = `QuestionPage${currentPage.id}`;
      const writeFragment = jest.fn();
      const readFragment = jest.fn(() => currentPage);

      const updater = deleteUpdater(currentPage.id, deletedAnswer.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: currentPage
      });
      expect(currentPage.answers).not.toContain(deletedAnswer);
    });
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
              input: { id: deletedAnswer.id }
            }
          })
        );
      });
    });

    it("should raise a toast after onDeleteAnswer is invoked", () => {
      return props.onDeleteAnswer(currentPage.id, deletedAnswer.id).then(() => {
        expect(raiseToast).toHaveBeenCalledWith(
          `Answer${deletedAnswer.id}`,
          expect.stringContaining("Answer"),
          "undeleteAnswer",
          expect.objectContaining({
            pageId: currentPage.id,
            answerId: deletedAnswer.id
          })
        );
      });
    });

    it("should return promise that resolves to deletePage result", () => {
      return expect(props.onDeleteAnswer(deletedAnswer.id)).resolves.toBe(
        result
      );
    });
  });
});
