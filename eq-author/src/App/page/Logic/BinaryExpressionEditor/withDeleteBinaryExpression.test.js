import { mapMutateToProps } from "./withDeleteBinaryExpression";

describe("withDeleteBinaryExpression", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a deleteBinaryExpression prop", () => {
      expect(props.deleteBinaryExpression).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.deleteBinaryExpression("id");
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { id: "id" } },
        update: expect.any(Function),
      });
    });

    it("should pass on result to onCompleted callback", () => {
      const onCompleted = jest.fn();
      const mockExpressionGroup = {
        id: "expression-group-1",
        expressions: [],
      };

      mutate.mockImplementation(({ update }) =>
        update(null, {
          data: {
            deleteBinaryExpression2: mockExpressionGroup,
          },
        })
      );

      props.deleteBinaryExpression(
        "my-least-favourite-expression",
        onCompleted
      );
      expect(onCompleted).toHaveBeenCalledWith(mockExpressionGroup);
    });
  });
});
