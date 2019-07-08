import { mapMutateToProps } from "./withDeleteOption";

describe("containers/QuestionnaireDesignPage/withDeleteOption", () => {
  let mutate, result, answer, option;

  beforeEach(() => {
    option = {
      id: "123",
    };

    answer = {
      id: "456",
      label: "foo",
      description: "bar",
      options: [option],
    };

    result = {
      data: {
        deleteOption: answer,
      },
    };

    mutate = jest.fn(() => Promise.resolve(result));
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
            input: { id: option.id },
          },
        })
      );
    });
  });
});
