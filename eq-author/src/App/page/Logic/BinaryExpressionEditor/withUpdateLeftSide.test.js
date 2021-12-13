import { mapMutateToProps } from "./withUpdateLeftSide";

describe("withUpdateLeftSide", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a updateLeftSide prop", () => {
      expect(props.updateLeftSide).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.updateLeftSide(
        {
          id: "id",
          foo: "bar",
        },
        "answerId"
      );
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { expressionId: "id", answerId: "answerId" } },
      });
    });
  });
});
