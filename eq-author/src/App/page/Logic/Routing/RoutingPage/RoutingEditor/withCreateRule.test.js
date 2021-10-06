import { mapMutateToProps } from "./withCreateRule";

describe("withCreateRule", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a createRule prop", () => {
      expect(props.createRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.createRule("id");
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { routingId: "id" } },
      });
    });
  });
});
