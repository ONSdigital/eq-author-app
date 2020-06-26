import { mapMutateToProps } from "./withDeleteSkipCondition";

describe("withDeleteSkipCondition", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a deleteSkipCondition prop", () => {
      expect(props.deleteSkipCondition).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.deleteSkipCondition("id");
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { id: "id" } },
      });
    });
  });
});
