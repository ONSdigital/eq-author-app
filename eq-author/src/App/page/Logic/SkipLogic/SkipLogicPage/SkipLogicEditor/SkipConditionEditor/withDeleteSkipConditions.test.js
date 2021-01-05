import { mapMutateToProps } from "./withDeleteSkipConditions";

describe("withDeleteSkipConditions", () => {
  describe("mapMutateToProps", () => {
    let props;
    let mutate;

    beforeEach(() => {
      mutate = jest.fn(() => Promise.resolve());
      props = mapMutateToProps({ mutate });
    });

    it("should have a deleteSkipConditions prop", () => {
      expect(props.deleteSkipConditions).toBeInstanceOf(Function);
    });

    it("should call mutate", () => {
      props.deleteSkipConditions("pageId");
      expect(mutate).toHaveBeenCalledWith({
        variables: { input: { parentId: "pageId" } },
      });
    });
  });
});
