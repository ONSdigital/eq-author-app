import { mapMutateToProps } from "./withDeleteRule";

describe("withDeleteRule", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a deleteRule prop", () => {
      expect(props.deleteRule).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.deleteRule("id");
      expect(mutate).toHaveBeenCalledWith({
        refetchQueries: ["GetQuestionnaire"],
        variables: { input: { id: "id" } },
      });
    });
  });
});
