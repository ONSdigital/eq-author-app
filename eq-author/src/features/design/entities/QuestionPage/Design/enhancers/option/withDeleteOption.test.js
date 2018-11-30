import { mapMutateToProps, createUpdater } from "./withDeleteOption";
import fragment from "graphql/answerFragment.graphql";

describe("containers/QuestionnaireDesignPage/withDeleteOption", () => {
  let mutate, result, answer, answerWithMutuallyExclusive, option;

  beforeEach(() => {
    option = {
      id: "123"
    };

    answer = {
      id: "456",
      label: "foo",
      description: "bar",
      options: [option]
    };

    answerWithMutuallyExclusive = {
      ...answer,
      mutuallyExclusiveOption: {
        id: option.id
      }
    };

    result = {
      data: {
        deleteOption: answer
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should update the cache pass and remove option", () => {
      const id = `MultipleChoiceAnswer${answer.id}`;
      const writeFragment = jest.fn();
      const readFragment = jest.fn(() => answer);

      const updater = createUpdater(option.id, answer.id);
      updater({ readFragment, writeFragment });

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: answer
      });
      expect(answer.options).not.toContain(option);
    });
  });

  it("should update the cache pass and unset mutuallyExclusiveOption", () => {
    const id = `MultipleChoiceAnswer${answerWithMutuallyExclusive.id}`;
    const writeFragment = jest.fn();
    const readFragment = jest.fn(() => answerWithMutuallyExclusive);

    const updater = createUpdater(option.id, answerWithMutuallyExclusive.id);
    updater({ readFragment, writeFragment });

    answerWithMutuallyExclusive.mutuallyExclusiveOption = null;

    expect(readFragment).toHaveBeenCalledWith({ id, fragment });
    expect(writeFragment).toHaveBeenCalledWith({
      id,
      fragment,
      data: answerWithMutuallyExclusive
    });
  });

  describe("mapMutateToProps", () => {
    let props;
    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onDeleteOption prop", () => {
      expect(props.onDeleteOption).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.onDeleteOption(option.id, answer.id);

      expect(mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: { id: option.id }
          }
        })
      );
    });
  });
});
