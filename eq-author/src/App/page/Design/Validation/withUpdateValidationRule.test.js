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

    const mutationInput = {
      id: "1",
      minValueInput: { inclusive: true, custom: "201", __typename: "foo" },
    };

    props.onUpdateValidationRule([mutationInput, { enabled: true }]);
    expect(mutate).toHaveBeenCalledWith({
      variables: {
        input: {
          id: mutationInput.id,
          minValueInput: {
            inclusive: mutationInput.minValueInput.inclusive,
            custom: mutationInput.minValueInput.custom,
          },
        },
      },
      optimisticResponse: {
        updateValidationRule: {
          __typename: "foo",
          custom: "201",
          inclusive: true,
          id: "1",
          enabled: true,
          metadata: null,
          previousAnswer: null,
          validationErrorInfo: {
            id: "id",
            errors: [],
            totalCount: 0,
            __typename: "validationErrorInfo",
          },
        },
      },
    });
  });
});
