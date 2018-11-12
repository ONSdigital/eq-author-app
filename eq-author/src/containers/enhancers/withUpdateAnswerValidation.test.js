import { mapMutateToProps } from "./withUpdateAnswerValidation";

describe("withUpdateAnswerValidation", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should add onUpdateAnswerValidation prop", () => {
    const props = mapMutateToProps({ mutate });
    expect(props.onUpdateAnswerValidation).toBeInstanceOf(Function);
  });

  it("should call mutate", () => {
    const props = mapMutateToProps({ mutate });
    const answer = {
      id: "1",
      minValueInput: { inclusive: true, custom: "201" }
    };

    props.onUpdateAnswerValidation(answer);
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: answer }
    });
  });
});
