import { mapMutateToProps } from "./withUpdateRightSide";

describe("withUpdateRightSide", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateRightSide prop", () => {
      expect(props.updateRightSide).toBeInstanceOf(Function);
    });

    it("should call mutate with custom value", () => {
      props.updateRightSide(
        {
          id: "id",
          foo: "bar",
        },
        { customValue: { number: 5 } }
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: {
          input: { expressionId: "id", customValue: { number: 5 } },
        },
      });
    });

    it("should call mutate with options", () => {
      props.updateRightSide(
        {
          id: "id",
          foo: "bar",
        },
        { selectedOptions: ["1", "2"] }
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: {
          input: { expressionId: "id", selectedOptions: ["1", "2"] },
        },
      });
    });
  });
});
