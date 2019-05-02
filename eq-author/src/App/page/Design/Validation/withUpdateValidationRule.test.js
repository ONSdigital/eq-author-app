import { mapMutateToProps } from "./withUpdateValidationRule";

describe("withUpdateValidationRule", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should add onUpdateValidationRule prop", () => {
    const props = mapMutateToProps({ mutate });
    expect(props.onUpdateValidationRule).toBeInstanceOf(Function);
  });

  it("should call mutate", () => {
    const props = mapMutateToProps({ mutate });
    const answer = {
      id: "1",
      minValueInput: { inclusive: true, custom: "201", __typename: "foo" },
    };

    props.onUpdateValidationRule(answer);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: answer.id,
          minValueInput: {
            inclusive: answer.minValueInput.inclusive,
            custom: answer.minValueInput.custom,
          },
        },
      },
    });
  });
});
