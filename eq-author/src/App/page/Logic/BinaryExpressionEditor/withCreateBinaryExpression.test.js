import { mapMutateToProps } from "./withCreateBinaryExpression";

describe("withCreateBinaryExpression", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a createBinaryExpression prop", () => {
      expect(props.createBinaryExpression).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.createBinaryExpression("id");
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { expressionGroupId: "id" } },
      });
    });
  });
});
