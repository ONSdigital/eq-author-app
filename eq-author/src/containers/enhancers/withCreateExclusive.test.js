import {
  mapMutateToProps,
  createUpdater
} from "containers/enhancers/withCreateExclusive";
import fragment from "graphql/answerFragment.graphql";

describe("withCreateExclusive", () => {
  let answer, mutate, result;

  beforeEach(() => {
    answer = {
      options: [{ id: "1" }],
      mutuallyExclusiveOption: null,
      other: null
    };

    result = {
      data: {
        createMutuallyExclusiveOption: {
          id: "2",
          description: null,
          label: null
        }
      }
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should update the cache", () => {
      const id = `MultipleChoiceAnswer${answer.id}`;
      const readFragment = jest.fn(() => answer);
      const writeFragment = jest.fn();

      const updater = createUpdater(answer.id);

      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });

      answer.mutuallyExclusiveOption =
        result.data.createMutuallyExclusiveOption;

      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: answer
      });
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onAddExclusive prop", () => {
      expect(props.onAddExclusive).toBeInstanceOf(Function);
    });

    describe("onAddExclusive", () => {
      it("should call mutate", () => {
        props.onAddExclusive(answer.id);

        expect(mutate).toHaveBeenCalledWith(
          expect.objectContaining({
            variables: {
              input: {
                answerId: answer.id
              }
            }
          })
        );
      });

      it("should unwrap the entity from the apollo result", () => {
        expect(props.onAddExclusive()).resolves.toBe(
          result.data.createMutuallyExclusiveOption
        );
      });
    });
  });
});
