import { mapMutateToProps, createUpdater } from "./withCreateOther";
import fragment from "graphql/answerFragment.graphql";
import optionFragment from "graphql/fragments/option.graphql";

describe("containers/enhancers/withCreateOther", () => {
  const checkboxAnswer = {
    id: "1",
    options: [
      {
        id: 1
      }
    ]
  };

  let mutate, result, other;

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

    result = {
      data: {
        createOther: other
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    let id;
    let writeFragment;
    let readFragment;
    let updater;

    beforeEach(() => {
      id = `MultipleChoiceAnswer${checkboxAnswer.id}`;
      writeFragment = jest.fn();
      readFragment = jest.fn(() => checkboxAnswer);
      updater = createUpdater(checkboxAnswer.id);
    });

    it("should update the apollo cache", () => {
      updater({ readFragment, writeFragment }, result);
      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: checkboxAnswer
      });

      expect(writeFragment).toHaveBeenCalledWith({
        id: `BasicAnswer${other.answer.id}`,
        fragment,
        data: other.answer
      });

      expect(writeFragment).toHaveBeenCalledWith({
        id: `Option${other.option.id}`,
        fragment: optionFragment,
        data: other.option
      });

      expect(checkboxAnswer.other).toMatchObject(other);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onAddOther prop", () => {
      expect(props.onAddOther).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      return props.onAddOther(checkboxAnswer).then(() => {
        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: { parentAnswerId: checkboxAnswer.id }
            }
          })
        );
      });
    });

    it("should unwrap the entity from the apollo result", () => {
      expect(props.onAddOther(checkboxAnswer)).resolves.toBe(other);
    });
  });
});
