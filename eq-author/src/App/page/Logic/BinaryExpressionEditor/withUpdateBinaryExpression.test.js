import { mapMutateToProps } from "./withUpdateBinaryExpression";

describe("withUpdateBinaryExpression", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateBinaryExpression prop", () => {
      expect(props.updateBinaryExpression).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.updateBinaryExpression(
        {
          id: "id",
          foo: "bar",
        },
        "Equals"
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { id: "id", condition: "Equals" } },
      });
    });
  });
});
