import {
  mapMutateToProps,
  deleteUpdater
} from "containers/enhancers/withDeleteOther";
import fragment from "graphql/answerFragment.graphql";

describe("containers/enhancers/withDeleteOther", () => {
  let mutate, result, raiseToast, ownProps;
  let other, checkboxAnswer;

  beforeEach(() => {
    other = {
      option: {
        id: 2
      },
      answer: {
        id: 2,
        type: "TextField"
      }
    };

    checkboxAnswer = {
      id: "1",
      sectionId: "1",
      options: [
        {
          id: 1,
          label: "one"
        }
      ],
      other
    };

    result = {
      data: {
        deleteOther: other
      }
    };

    raiseToast = jest.fn(() => Promise.resolve());

    ownProps = {
      raiseToast
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("deleteUpdater", () => {
    it("should remove the other from the cache", () => {
      const id = `MultipleChoiceAnswer${checkboxAnswer.id}`;
      const writeFragment = jest.fn();
      const readFragment = jest.fn(() => checkboxAnswer);

      const updater = deleteUpdater(checkboxAnswer.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: checkboxAnswer
      });
      expect(checkboxAnswer.other).toBeNull();
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ ownProps, mutate });
    });

    it("should call mutate when onDeleteOther is invoked", () => {
      return props.onDeleteOther(checkboxAnswer).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: { parentAnswerId: checkboxAnswer.id }
            }
          })
        );
      });
    });

    it("should return promise that resolves to deleteOther result", () => {
      return expect(props.onDeleteOther(checkboxAnswer)).resolves.toBe(result);
    });
  });
});
