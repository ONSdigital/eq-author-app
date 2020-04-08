import { mapMutateToProps } from "./withToggleValidationRule";

describe("withToggleValidationRule", () => {
  let mutate;

  beforeEach(() => {
    mutate = jest.fn();
  });

  it("should add onToggleValidationRule prop", () => {
    const props = mapMutateToProps({
      mutate,
    });

    expect(props.onToggleValidationRule).toBeInstanceOf(Function);
  });

  it("should call mutate", () => {
    const props = mapMutateToProps({ mutate });
    const validationRule = {
      id: "1",
      enabled: true,
    };

    props.onToggleValidationRule(validationRule);
    expect(mutate).toHaveBeenCalledWith({
      variables: { input: validationRule },
      refetchQueries: ["GetPage"],
    });
  });
});
