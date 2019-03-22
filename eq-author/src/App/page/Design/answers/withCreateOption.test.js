import { mapMutateToProps, createUpdater } from "./withCreateOption";
import fragment from "graphql/answerFragment.graphql";

describe("containers/QuestionnaireDesignPage/withCreateOption", () => {
  const answer = {
    id: "1",
    options: [],
  };

  let mutate, result, newOption;

  beforeEach(() => {
    newOption = {
      id: "2",
    };

    result = {
      data: {
        createOption: newOption,
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
  });

  describe("createUpdater", () => {
    it("should update the cache pass and the result to be the correct page", () => {
      const id = `MultipleChoiceAnswer${answer.id}`;
      const writeFragment = jest.fn();
      const readFragment = jest.fn(() => answer);

      const updater = createUpdater(answer.id);
      updater({ readFragment, writeFragment }, result);

      expect(readFragment).toHaveBeenCalledWith({ id, fragment });
      expect(writeFragment).toHaveBeenCalledWith({
        id,
        fragment,
        data: answer,
      });
      expect(answer.options).toContain(newOption);
    });
  });

  describe("mapMutateToProps", () => {
    let props;

    beforeEach(() => {
      props = mapMutateToProps({ mutate });
    });

    it("should have a onAddOption prop", () => {
      expect(props.onAddOption).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      return props
        .onAddOption(answer.id, { hasAdditionalAnswer: false })
        .then(() => {
          expect(mutate).toHaveBeenCalledWith(
            expect.objectContaining({
              variables: {
                input: { answerId: answer.id, hasAdditionalAnswer: false },
              },
            })
          );
        });
    });

    it("should unwrap the entity from the apollo result", () => {
      expect(
        props.onAddOption(answer.id, { hasAdditionalAnswer: false })
      ).resolves.toBe(newOption);
    });
  });
});
