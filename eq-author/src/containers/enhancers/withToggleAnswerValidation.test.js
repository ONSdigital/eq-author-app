import { mapMutateToProps } from "./withToggleAnswerValidation";

describe("withToggleAnswerValidation", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should add onToggleValidationRule prop", () => {
    const props = mapMutateToProps({
      mutate
    });

    expect(props.onToggleValidationRule).toBeInstanceOf(Function);
  });

  it("should call mutate", () => {
    const props = mapMutateToProps({ mutate });
    const answer = {
      id: "1",
      minValueInput: { inclusive: true, custom: "201" }
    };

    props.onToggleValidationRule(answer);
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: answer }
    });
  });
});
